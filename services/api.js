export const getAllQuiz = async () => {
    try {
        const res = await fetch('http://localhost:3000/quizs'); // call api:bất đồng bộ
        const data = await res.json();
        return data;
    } catch (error) {
        alert("Lỗi");
    }
};

export const getQuestionsByIdQuiz = async (idQuiz) => {
    try {
        const res = await fetch(`http://localhost:3000/questions?quizId=${idQuiz}`); // call api:bất đồng bộ
        const data = await res.json();
        return data;
    } catch (error) {
        alert("Lỗi");
    }
};

export const getQuizById = async (id) => {
    try {
        const res = await fetch(`http://localhost:3000/quizs/${id}`);
        const data = await res.json();
        console.log("Dữ liệu từ API:", data); // Kiểm tra dữ liệu từ API
        return data;
    } catch (error) {
        alert(error);
    }
};

export const addQuiz = async (data) => {
    try {
        const res = await fetch('http://localhost:3000/quizs', {
            method: "post", // phương thức thêm mới
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // chuyển dữ liệu từ object -> JSON
        });
        const dataRes = await res.json();
        return dataRes;
    } catch (error) {
        alert("Thêm lỗi");
    }
};

export const addQuestions = async (datas) => {
    try {
        datas.forEach(async (item) => {
            await fetch('http://localhost:3000/questions', {
                method: "post", // phương thức thêm mới
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item) // chuyển dữ liệu từ object -> JSON
            });
        });
    } catch (error) {
        alert("Thêm lỗi");
    }
};

export const deleteQuiz = async (id) => {
    try {
        await fetch(`http://localhost:3000/quizs/${id}`, {
            method: "delete"
        });
        alert("Xóa thành công");
    } catch (error) {
        alert("Lỗi");
    }
};

export const deleteQuestion = async (id) => {
    try {
        await fetch(`http://localhost:3000/questions/${id}`, {
            method: "delete"
        });
        alert("Xóa thành công");
    } catch (error) {
        alert("Lỗi");
    }
};

export const updateQuiz = async (id, data) => {
    try {
        await fetch(`http://localhost:3000/quizs/${id}`, {
            method: "put",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        alert("Cập nhật thất bại");
    }
};

export const getQuestionById = async (id) => {
    const response = await fetch(`http://localhost:3000/questions/${id}`);
    return await response.json();
};

export const updateQuestion = async (id, question) => {
    const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(question)
    });
    return await response.json();
};

// Hàm yêu cầu người dùng nhập tên và lưu điểm số
// Hàm yêu cầu người dùng nhập tên và lưu điểm số
export const promptForUserName = async (score, calculateCompletionTime) => {
    const userName = prompt("Hãy điền tên của bạn:");
    if (userName) {
        const completionTime = calculateCompletionTime(); // Tính thời gian hoàn thành
        await saveScore(userName, score, completionTime); // Lưu điểm số
    } else {
        alert("Bạn cần nhập tên để lưu điểm số.");
    }
};


// Hàm lưu điểm số người dùng
export const saveScore = async (scoreData) => {
    try {
        const response = await fetch('http://localhost:3000/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scoreData),
        });
        return await response.json();
    } catch (error) {
        console.error('Error saving score:', error);
    }
};

// Hàm tính thời gian hoàn thành
export const calculateCompletionTime = (startTime) => {
    const endTime = new Date(); // Thời gian hiện tại khi hoàn thành
    const timeTaken = Math.floor((endTime - startTime) / 1000); // Tính thời gian hoàn thành (giây)
    return timeTaken; // Trả về thời gian hoàn thành
};
export const getScores = async () => {
    try {
        const response = await fetch('http://localhost:3000/scores');
        if (!response.ok) throw new Error('Failed to fetch scores');
        return await response.json();
    } catch (error) {
        console.error('Error fetching scores:', error);
    }
};
