from fastapi import FastAPI, Form, UploadFile

from sns.snsDAO import SNSDAO
from member.memberDAO import MemberDAO


app = FastAPI()
mDAO = MemberDAO()
sDAO = SNSDAO()


@app.get("/member.bye")
def memberBye(member):
    return mDAO.bye(member, sDAO)


@app.get("/member.id.check")
def memberIdCheck(id):
    return mDAO.idCheck(id)


@app.get("/member.info.get")
def memberInfoGet(member):
    return mDAO.getMemberInfo(member)


@app.get("/member.psa.get")
def memberPsaGet(psa):
    return mDAO.getPsaFile(psa)


@app.get("/member.sign.in.exp.update")
def memberSignInExpUpdate(member):
    return mDAO.signInExpUpdate(member)


@app.post("/member.update")
async def memberUpdate(
    psa: UploadFile,
    pw: str = Form(),
    name: str = Form(),
    addr1: str = Form(),
    addr2: str = Form(),
    addr3: str = Form(),
    member: str = Form(),
):
    return await mDAO.update(psa, pw, name, addr1, addr2, addr3, member)


@app.post("/member.update.no.psa")
def memberUpdate(
    pw: str = Form(),
    name: str = Form(),
    addr1: str = Form(),
    addr2: str = Form(),
    addr3: str = Form(),
    token: str = Form(),
):
    return mDAO.updateNoPsa(pw, name, addr1, addr2, addr3, token)


@app.post("/sign.in")
def signIn(id: str = Form(), pw: str = Form()):
    return mDAO.signIn(id, pw)


@app.post("/sign.up")
async def signUp(
    psa: UploadFile,
    id: str = Form(),
    pw: str = Form(),
    name: str = Form(),
    jumin1: str = Form(),
    jumin2: str = Form(),
    addr1: str = Form(),
    addr2: str = Form(),
    addr3: str = Form(),
):
    return await mDAO.signUp(psa, id, pw, name, jumin1, jumin2, addr1, addr2, addr3)


@app.get("/sns.post.delete")
def snsPostGet(no: int):
    return sDAO.deletePost(no)


@app.get("/sns.post.get")
def snsPostGet(page: int, search):
    return sDAO.getPost(page, search)


@app.get("/sns.post.reply.write")
def snsPostReplyWrite(postNo: int, txt, member):
    return sDAO.writePostReply(postNo, txt, member)


@app.get("/sns.post.update")
def snsPostWrite(no: int, txt, member):
    return sDAO.updatePost(no, txt, member)


@app.get("/sns.post.write")
def snsPostWrite(color, txt, member):
    return sDAO.writePost(color, txt, member)
