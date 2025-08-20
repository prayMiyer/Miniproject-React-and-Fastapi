from datetime import datetime
from http.client import HTTPSConnection
from json import loads
from math import ceil
from fastapi.responses import JSONResponse
import jwt
from ssy.ssyDBManager import ssyDBManager


class SNSDAO:
    def __init__(self):
        self.jwtKey = "jdfiadshglifjkg"
        self.jwtAlgorithm = "HS256"
        self.setAllPostCount()
        self.postPerPage = 5

    def deletePost(self, no):
        h = {"Access-Control-Allow-Origin": "*"}
        try:
            con, cur = ssyDBManager.makeConCur("ssy/1@192.168.254.40:1521/xe")
            sql = "delete from ms_aisa_sns_post where masp_no = %d " % no
            cur.execute(sql)
            if cur.rowcount == 1:
                self.allPostCount -= 1
                con.commit()
                return JSONResponse({"result": "삭제 성공"}, headers=h)
            raise
        except:
            return JSONResponse({"result": "삭제 실패"}, headers=h)
        finally:
            ssyDBManager.closeConCur(con, cur)

    def setAllPostCount(self):
        try:
            con, cur = ssyDBManager.makeConCur("ssy/1@192.168.254.40:1521/xe")

            sql = "select count(*) from ms_aisa_sns_post"
            cur.execute(sql)

            for c in cur:
                self.allPostCount = c[0]
        except:
            pass
        finally:
            ssyDBManager.closeConCur(con, cur)

    def getSearchPostCount(self, search):
        try:
            con, cur = ssyDBManager.makeConCur("ssy/1@192.168.254.40:1521/xe")

            sql = (
                "select count(*) from ms_aisa_sns_post where masp_txt like '%s'"
                % search
            )
            cur.execute(sql)

            for c in cur:
                return c[0]
        except:
            pass
        finally:
            ssyDBManager.closeConCur(con, cur)

    def getPost(self, page, search):
        h = {"Access-Control-Allow-Origin": "*"}
        try:
            con, cur = ssyDBManager.makeConCur("ssy/1@192.168.254.40:1521/xe")

            search = "%" + search + "%"
            postCount = self.allPostCount
            if search != "%%":
                postCount = self.getSearchPostCount(search)

            pageCount = ceil(postCount / self.postPerPage)
            start = (page - 1) * self.postPerPage + 1
            end = page * self.postPerPage

            sql = (
                "SELECT masp_no, masp_writer, masp_txt, masp_color, masp_date, mam_psa "
            )
            sql += "FROM ( "
            sql += "    SELECT masp_no, masp_writer, masp_txt, masp_color, masp_date "
            sql += "    FROM ( "
            sql += "        SELECT rownum AS rn, masp_no, masp_writer, masp_txt, masp_color, masp_date "
            sql += "        FROM ( "
            sql += "            SELECT masp_no, masp_writer, masp_txt, masp_color, masp_date "
            sql += "            FROM ms_aisa_sns_post "
            sql += "            WHERE masp_txt LIKE '%s' " % search
            sql += "            ORDER BY masp_date DESC "
            sql += "        )"
            sql += "    )"
            sql += "    WHERE rn >= %d AND rn <= %d " % (start, end)
            sql += "), ( "
            sql += "    SELECT mam_id, mam_psa "
            sql += "    FROM ms_aisa_member "
            sql += "    WHERE mam_id IN ( "
            sql += "        SELECT masp_writer "
            sql += "        FROM ( "
            sql += "            SELECT rownum AS rn, masp_no, masp_writer, masp_txt, masp_color, masp_date "
            sql += "            FROM ( "
            sql += "                SELECT masp_no, masp_writer, masp_txt, masp_color, masp_date "
            sql += "                FROM ms_aisa_sns_post "
            sql += "                WHERE masp_txt LIKE '%s' " % search
            sql += "                ORDER BY masp_date DESC "
            sql += "            ) "
            sql += "        ) "
            sql += "        WHERE rn >= %d AND rn <= %d " % (start, end)
            sql += "    ) "
            sql += ") "
            sql += "WHERE masp_writer = mam_id "
            sql += "ORDER BY masp_date DESC"
            cur.execute(sql)

            posts = []
            for no, writer, txt, color, date, psa in cur:
                posts.append(
                    {
                        "no": no,
                        "writer": writer,
                        "txt": txt,
                        "color": "#" + color,
                        "date": datetime.strftime(date, "%Y-%m-%d %H:%M:%S"),
                        "psa": psa,
                        "replys": self.getPostReply(no),
                    }
                )
            return JSONResponse(
                {"result": "조회 성공", "pageCount": pageCount, "posts": posts},
                headers=h,
            )
        except:
            return JSONResponse({"result": "조회 실패"}, headers=h)
        finally:
            ssyDBManager.closeConCur(con, cur)

    def getPostReply(self, postNo):
        try:
            con, cur = ssyDBManager.makeConCur("ssy/1@192.168.254.40:1521/xe")

            sql = (
                "SELECT * FROM ms_aisa_sns_post_reply WHERE maspr_masp_no = %d ORDER BY maspr_date"
                % postNo
            )
            cur.execute(sql)

            replys = []
            for no, masp_no, writer, txt, date in cur:
                replys.append(
                    {
                        "no": no,
                        "postNo": masp_no,
                        "writer": writer,
                        "txt": txt,
                        "date": datetime.strftime(date, "%Y-%m-%d %H:%M:%S"),
                    }
                )
            return replys
        except:
            return None
        finally:
            ssyDBManager.closeConCur(con, cur)

    def updatePost(self, no, txt, member):
        h = {"Access-Control-Allow-Origin": "*"}
        try:
            con, cur = ssyDBManager.makeConCur("ssy/1@192.168.254.40:1521/xe")
            txt = txt.replace('"', "").replace("\\n", "\r\n")
            r = jwt.decode(member, self.jwtKey, self.jwtAlgorithm)
            sql = "update ms_aisa_sns_post "
            sql += "set masp_txt='%s' " % txt
            sql += "where masp_no=%d" % no
            cur.execute(sql)
            if cur.rowcount == 1:
                con.commit()
                return JSONResponse({"result": "수정 성공"}, headers=h)
            raise
        except:
            return JSONResponse({"result": "수정 실패"}, headers=h)

    def writePost(self, color, txt, member):
        h = {"Access-Control-Allow-Origin": "*"}
        try:
            con, cur = ssyDBManager.makeConCur("ssy/1@192.168.254.40:1521/xe")
            txt = txt.replace('"', "").replace("\\n", "\r\n")
            r = jwt.decode(member, self.jwtKey, self.jwtAlgorithm)
            sql = "insert into ms_aisa_sns_post values(ms_aisa_sns_post_seq.nextval, "
            sql += "'%s', '%s', '%s', sysdate)" % (r["id"], txt, color)
            cur.execute(sql)
            if cur.rowcount == 1:
                self.writeWeather(color)
                self.allPostCount += 1
                con.commit()
                return JSONResponse({"result": "글쓰기 성공"}, headers=h)
            raise
        except:
            return JSONResponse({"result": "글쓰기 실패"}, headers=h)
        finally:
            ssyDBManager.closeConCur(con, cur)

    def writePostReply(self, postNo, txt, member):
        h = {"Access-Control-Allow-Origin": "*"}
        try:
            con, cur = ssyDBManager.makeConCur("ssy/1@192.168.254.40:1521/xe")
            r = jwt.decode(member, self.jwtKey, self.jwtAlgorithm)
            sql = "insert into ms_aisa_sns_post_reply values(ms_aisa_sns_post_reply_seq.nextval, "
            sql += "%d, '%s', '%s', sysdate)" % (postNo, r["id"], txt)
            cur.execute(sql)
            if cur.rowcount == 1:
                con.commit()
                return JSONResponse({"result": "댓글쓰기 성공"}, headers=h)
            raise
        except Exception as e:
            return JSONResponse({"result": "댓글쓰기 실패"}, headers=h)
        finally:
            ssyDBManager.closeConCur(con, cur)

    def writeWeather(self, color):
        try:
            con, cur = ssyDBManager.makeConCur("ssy/1@192.168.254.40:1521/xe")

            huc = HTTPSConnection("api.openweathermap.org")
            huc.request(
                "GET",
                "/data/2.5/weather?q=seoul&appid=baff8f3c6cbc28a4024e336599de28c4&units=metric&lang=kr",
            )
            weatherData = loads(huc.getresponse().read())
            desc = weatherData["weather"][0]["description"]
            temp = weatherData["main"]["temp"]
            humi = weatherData["main"]["humidity"]
            sql = "insert into ms_aisa_weathercolor values('%s', %.2f, %d, '%s')" % (
                desc,
                temp,
                humi,
                color,
            )
            cur.execute(sql)
            if cur.rowcount == 1:
                con.commit()
            else:
                raise
        except:
            pass
        finally:
            huc.close()
            ssyDBManager.closeConCur(con, cur)
