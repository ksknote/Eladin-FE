const updateButton = document.querySelector(".change-user-info");

const isMatchEmail = (email) => {
    const deleteSpace = email.value.trim();
    if (deleteSpace.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) return true;
    return false;
};

const isMatchPassword = (password, checkPassword) => {
    const deleteSpacePassword = password.value.trim();
    const deleteSpaceCheckPassword = checkPassword.value.trim();
    if (
        deleteSpacePassword.match(/^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/) &&
        deleteSpacePassword === deleteSpaceCheckPassword
    )
        return true;

    return false;
};

const updateUserInfo = async () => {
    const userName = document.querySelector(".change-username");
    const email = document.querySelector(".change-email");
    const password = document.querySelector("#new-password");

    const checkPassword = document.querySelector("#new-password-check");

    const inValidOutlineStyle = "2px solid red";

    if (!isMatchEmail(email)) {
        email.style.outline = inValidOutlineStyle;
        window.alert("이메일 형식이 올바르지 않습니다!");
    } else if (!isMatchPassword(password, checkPassword)) {
        password.style.outline = inValidOutlineStyle;
        checkPassword.style.outline = inValidOutlineStyle;
        window.alert(
            "패스워드 형식이 올바르지 않습니다! 일치여부도 다시 한 번 확인해주세요!"
        ); // 여기부분까지만 건드려주세용. +요기는 비번이랑 비번확인 체크가 같이 있고, 클릭이벤트 핸들러라서 아래에다가 작성했어용.
    } else {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const userId = JSON.parse(localStorage.getItem("userData")).userId;
            const header = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            };
            const body = {
                userName: userName.value.trim(),
                password: password.value,
                email: email.value,
            };
            const uri = "http://localhost:5500/auth/me";

            const updateResponse = await axios.patch(uri, body, header);
            const updateMessage = await updateResponse.data.message;
            localStorage.setItem(
                "myData",
                JSON.stringify({
                    userName: body.userName,
                    email: body.email,
                    userId: userId,
                })
            ); // 백 데이터 넘겨주는거 변경됐을 때 풀기.
            window.alert(updateMessage);
            window.location.href = "./mypage.html";
        } catch (err) {
            console.log(err);
            window.alert(`서버오류입니다! ${err.response.data.message}`);
        }
    }
};

updateButton.addEventListener("click", updateUserInfo);

//이메일, 비밀번호 유효성 검사(타자칠 때, 포커스 나갔을 때)
const email = document.querySelector(".change-email");
const password = document.querySelector("#new-password");
const checkPassword = document.querySelector("#new-password-check");

const inputList = [email, password, checkPassword];

inputList.forEach((input) => {
    input.addEventListener("keyup", () => {
        checkInputs(input);
    });
    input.addEventListener("blur", () => {
        checkInputs(input);
    });
});

function checkInputs(input) {
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const checkPasswordValue = checkPassword.value.trim();

    const regul1 = /^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/; // 패스워드
    const regul2 = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; //이메일

    if (input === email) {
        if (emailValue === "") {
            setErrorFor(email, "이메일을 입력하세요.");
        } else if (!regul2.test(emailValue)) {
            setErrorFor(email, "이메일 형식에 맞게 입력해주세요.");
        } else {
            setSuccessFor(email);
        }
    } else if (input === password) {
        if (passwordValue === "") {
            setErrorFor(password, "비밀번호를 입력하세요.");
        } else if (!regul1.test(passwordValue)) {
            setErrorFor(password, "8~16자 영문, 숫자를 사용하세요.");
        } else {
            setSuccessFor(password);
        }
    } else if (input === checkPassword) {
        if (checkPasswordValue === "") {
            setErrorFor(checkPassword, "비밀번호를 입력하세요.");
        } else if (passwordValue !== checkPasswordValue) {
            setErrorFor(checkPassword, "비밀번호가 일치하지 않습니다.");
        } else {
            setSuccessFor(checkPassword);
        }
    }
}

function setErrorFor(input, message) {
    const inputFormDiv = input.parentElement;
    const small = inputFormDiv.querySelector("small");

    small.innerText = message;
    inputFormDiv.classList.remove("success");
    inputFormDiv.classList.add("error");
}

function setSuccessFor(input) {
    const inputFormDiv = input.parentElement;
    inputFormDiv.classList.remove("error");
    inputFormDiv.classList.add("success");
}
