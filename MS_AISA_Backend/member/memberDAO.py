from datetime import datetime, timedelta, timezone
from os import remove
from fastapi.responses import FileResponse, JSONResponse
import jwt

from ssy.ssyDBManager import ssyDBManager
from ssy.ssyFileNameGenerator import ssyFileNameGenerator


class MemberDAO:
    def __init__(self):
        self.psaFolder = "./member/psa/"
        self.jwtKey = "jdfiadshglifjkg"
        self.jwtAlgorithm = "HS256"

    def bye(self, member, sDAO):
        h = {"Access-Control-Allow-Origin": "*"}
        try:
            con, cur = ssyDBManager.makeConCur("ssy/1@192.168.254.40:1521/xe")
            r = jwt.decode(member, self.jwtKey, self.jwtAlgorithm)
            sql = "delete from ms_aisa_member where mam_id='%s'" % r["id"]
            cur.execute(sql)
            if cur.rowcount == 1:
                remove(self.psaFolder + r["psa"])
                sDAO.setAllPostCount()
                con.commit()
                return JSONResponse({"result": "탈퇴 성공"}, headers=h)
            raise
        except:
            return JSONResponse({"result": "탈퇴 실패"}, headers=h)
        finally:
            ssyDBManager.closeConCur(con, cur)

    def getMemberInfo(self, member):
        h = {"Access-Control-Allow-Origin": "*"}
        try:
            r = jwt.decode(member, self.jwtKey, self.jwtAlgorithm)
            r = {
                "id": r["id"],
                "pw": r["pw"],
                "name": r["name"],
                "birthday": r["birthday"],
                "address": r["address"],
                "psa": r["psa"],
            }
            return JSONResponse({"result": "로그인 성공", "member": r}, headers=h)
        except jwt.ExpiredSignatureError:
            return JSONResponse({"result": "만료"}, headers=h)
        except jwt.exceptions.DecodeError:
            return JSONResponse({"result": "로그인 안함"}, headers=h)

    def getPsaFile(self, psa):
        return FileResponse(self.psaFolder + psa, filename=psa)

    def idCheck(self, id):
        h = {"Access-Control-Allow-Origin": "*"}
        try:
            con, cur = ssyDBManager.makeConCur("ssy/1@192.168.254.40:1521/xe")
            sql = "select count(*) from ms_aisa_member where mam_id='%s'" % id
            cur.execute(sql)
            for m in cur:
                if m[0] == 1:
                    return JSONResponse({"result": "존재하는 ID"}, headers=h)
            return JSONResponse({"result": "사용가능 ID"}, headers=h)
        except:
            return JSONResponse({"result": "DB문제 발생"}, headers=h)
        finally:
            ssyDBManager.closeConCur(con, cur)

    def signIn(self, id, pw):
        h = {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Credentials": "true",
        }
        try:
            con, cur = ssyDBManager.makeConCur("ssy/1@192.168.254.40:1521/xe")
            sql = "select * from ms_aisa_member WHERE mam_id='%s'" % id
            cur.execute(sql)
            count = 0
            for dbid, dbpw, name, birthday, address, psa in cur:
                count += 1
                if pw == dbpw:
                    r = {
                        "id": id,
                        "pw": pw,
                        "name": name,
                        "birthday": datetime.strftime(birthday, "%Y-%m-%d"),
                        "address": address,
                        "psa": psa,
                        "exp": datetime.now(timezone.utc) + timedelta(minutes=30),
                    }
                    r = jwt.encode(r, self.jwtKey, self.jwtAlgorithm)
                    return JSONResponse(
                        {"result": "로그인 성공", "member": r}, headers=h
                    )
                else:
                    return JSONResponse({"result": "로그인 실패(PW오류)"}, headers=h)
            if count == 0:
                return JSONResponse({"result": "로그인 실패(미가입ID)"}, headers=h)
            raise
        except:
            return JSONResponse({"result": "로그인 실패(DB오류)"}, headers=h)
        finally:
            ssyDBManager.closeConCur(con, cur)

    def signInExpUpdate(self, member):
        h = {"Access-Control-Allow-Origin": "*"}
        try:
            r = jwt.decode(member, self.jwtKey, self.jwtAlgorithm)
            r = {
                "id": r["id"],
                "pw": r["pw"],
                "name": r["name"],
                "birthday": r["birthday"],
                "address": r["address"],
                "psa": r["psa"],
                "exp": datetime.now(timezone.utc) + timedelta(minutes=30),
            }
            r = jwt.encode(r, self.jwtKey, self.jwtAlgorithm)
            return JSONResponse({"result": "로그인 성공", "member": r}, headers=h)
        except jwt.ExpiredSignatureError:
            return JSONResponse({"result": "만료"}, headers=h)
        except jwt.exceptions.DecodeError:
            return JSONResponse({"result": "로그인 안함"}, headers=h)

    async def signUp(self, psa, id, pw, name, jumin1, jumin2, addr1, addr2, addr3):
        h = {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Credentials": "true",
        }
        try:
            content = await psa.read()
            if len(content) > 31457280:
                raise
            fileName = ssyFileNameGenerator.generate(psa.filename, "date")
            f = open(self.psaFolder + fileName, "wb")
            f.write(content)
            f.close()
        except:
            return JSONResponse({"result": "가입 실패(프사)"}, headers=h)
        try:
            con, cur = ssyDBManager.makeConCur("ssy/1@192.168.254.40:1521/xe")
            if jumin2 == "1" or jumin2 == "2":
                birthday = "19" + jumin1
            elif jumin2 == "3" or jumin2 == "4":
                birthday = "20" + jumin1
            address = addr2 + "!" + addr3 + "!" + addr1
            sql = (
                "INSERT INTO ms_aisa_member VALUES('%s', '%s', '%s', to_date('%s', 'YYYYMMDD'), '%s', '%s')"
                % (id, pw, name, birthday, address, fileName)
            )
            cur.execute(sql)
            if cur.rowcount == 1:
                con.commit()
                return JSONResponse({"result": id + " 가입 성공"}, headers=h)
            raise
        except:
            remove(self.psaFolder + fileName)
            return JSONResponse({"result": id + " 가입 실패(DB)"}, headers=h)
        finally:
            ssyDBManager.closeConCur(con, cur)

    async def update(self, psa, pw, name, addr1, addr2, addr3, member):
        h = {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Credentials": "true",
        }
        try:
            content = await psa.read()
            if len(content) > 31457280:
                raise
            fileName = ssyFileNameGenerator.generate(psa.filename, "date")
            f = open(self.psaFolder + fileName, "wb")
            f.write(content)
            f.close()
            print(fileName)
        except:
            return JSONResponse({"result": "수정 실패(프사)"}, headers=h)

        try:
            con, cur = ssyDBManager.makeConCur("ssy/1@192.168.254.40:1521/xe")
            address = addr2 + "!" + addr3 + "!" + addr1
            r = jwt.decode(member, self.jwtKey, self.jwtAlgorithm)
            sql = "UPDATE ms_aisa_member "
            sql += "SET mam_pw='%s', mam_name='%s', mam_address='%s', mam_psa='%s' " % (
                pw,
                name,
                address,
                fileName,
            )
            sql += "WHERE mam_id='%s'" % r["id"]
            cur.execute(sql)
            if cur.rowcount == 1:
                con.commit()
                remove(self.psaFolder + r["psa"])
                r = {
                    "id": r["id"],
                    "pw": pw,
                    "name": name,
                    "birthday": r["birthday"],
                    "address": address,
                    "psa": fileName,
                    "exp": datetime.now(timezone.utc) + timedelta(minutes=30),
                }
                r = jwt.encode(r, self.jwtKey, self.jwtAlgorithm)
                return JSONResponse({"result": "수정 성공", "member": r}, headers=h)
            raise
        except:
            remove(self.psaFolder + fileName)
            return JSONResponse({"result": "수정 실패(DB)"}, headers=h)
        finally:
            ssyDBManager.closeConCur(con, cur)

    def updateNoPsa(self, pw, name, addr1, addr2, addr3, token):
        h = {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Credentials": "true",
        }
        try:
            con, cur = ssyDBManager.makeConCur("ssy/1@192.168.254.40:1521/xe")
            address = addr2 + "!" + addr3 + "!" + addr1
            r = jwt.decode(token, self.jwtKey, self.jwtAlgorithm)
            sql = "UPDATE ms_aisa_member "
            sql += "SET mam_pw='%s', mam_name='%s', mam_address='%s' " % (
                pw,
                name,
                address,
            )
            sql += "WHERE mam_id='%s'" % r["id"]
            cur.execute(sql)
            if cur.rowcount == 1:
                con.commit()
                r = {
                    "id": r["id"],
                    "pw": pw,
                    "name": name,
                    "birthday": r["birthday"],
                    "address": address,
                    "psa": r["psa"],
                    "exp": datetime.now(timezone.utc) + timedelta(minutes=30),
                }
                r = jwt.encode(r, self.jwtKey, self.jwtAlgorithm)
                return JSONResponse({"result": "수정 성공", "member": r}, headers=h)
            raise
        except:
            return JSONResponse({"result": "수정 실패"}, headers=h)
        finally:
            ssyDBManager.closeConCur(con, cur)
