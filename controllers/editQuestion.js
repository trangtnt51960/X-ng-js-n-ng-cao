import { getQuestionById, updateQuestion } from '../services/api.js'; // Nhập API

const app = {
    questionId: null, // Biến lưu trữ ID câu hỏi
    quizId: null, // Biến lưu trữ ID quiz

    init: async function () {
        // Lấy ID câu hỏi và ID quiz từ URL
        const urlParams = new URLSearchParams(window.location.search);
        this.questionId = urlParams.get('id');
        this.quizId = urlParams.get('quizId'); // Lấy quizId từ URL
    
        // Kiểm tra nếu questionId không hợp lệ (null hoặc không tồn tại)
        if (!this.questionId || this.questionId === 'null') {
            alert("ID câu hỏi không hợp lệ trong URL");
            window.location.href = 'listQuiz.html'; // Chuyển hướng về danh sách quiz
            return; // Ngừng thực hiện nếu không có ID
        }
    
        // Lấy thông tin câu hỏi từ API
        const question = await getQuestionById(this.questionId);
        console.log("Câu hỏi trả về từ API:", question); // Kiểm tra dữ liệu trả về
    
        this.renderQuestion(question);
        this.handleAddAnswer(); // Gọi hàm thêm đáp án
        this.handleSubmit(); // Gọi hàm lưu câu hỏi
    },
    

    renderQuestion: function (question) {
        if (!question) {
            alert("Câu hỏi không tồn tại!");
            return;
        }

        // Hiển thị tiêu đề câu hỏi
        document.getElementById('questionTiltle').value = question.questionTiltle || ''; // Đảm bảo có giá trị

        // Hiển thị loại câu hỏi
        const questionTypeSelect = document.getElementById('questionType');
        questionTypeSelect.value = question.questionType || 'multiple-choice'; // Loại mặc định

        // Hiển thị đáp án
        const answersContainer = document.getElementById('answersContainer');
        answersContainer.innerHTML = ''; // Xóa nội dung cũ trước khi thêm mới

        question.answers.forEach((answer, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'input-group mb-2';
            const answerInput = document.createElement('input');
            answerInput.type = 'text';
            answerInput.className = 'form-control';
            answerInput.value = answer.answerTitle || ''; // Đảm bảo có giá trị

            // Tạo nhãn cho đáp án
            const label = document.createElement('span');
            label.className = 'input-group-text';
            label.textContent = `Đáp án ${index + 1}:`;

            answerDiv.appendChild(label);
            answerDiv.appendChild(answerInput);
            answersContainer.appendChild(answerDiv);
        });

        // Hiển thị đáp án đúng
        document.getElementById('correctAnser').value = question.correctAnser ? question.correctAnser.join(', ') : ''; // Đảm bảo có giá trị
    },

    handleAddAnswer: function () {
        document.getElementById('addAnswerBtn').addEventListener('click', () => {
            const answersContainer = document.getElementById('answersContainer');
            const answerDiv = document.createElement('div');
            answerDiv.className = 'input-group mb-2';
            const answerInput = document.createElement('input');
            answerInput.type = 'text';
            answerInput.className = 'form-control';

            // Tạo nhãn cho đáp án
            const label = document.createElement('span');
            label.className = 'input-group-text';
            label.textContent = `Đáp án ${answersContainer.childElementCount + 1}:`;

            answerDiv.appendChild(label);
            answerDiv.appendChild(answerInput);
            answersContainer.appendChild(answerDiv);
        });
    },
    handleSubmit: function () {
        const form = document.getElementById('editQuestionForm');
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của form
    
            const questionTiltle = document.getElementById('questionTiltle').value;
            const questionType = document.getElementById('questionType').value;
            const answers = Array.from(document.querySelectorAll('#answersContainer input')).map(input => {
                return { answerTitle: input.value };
            });
            const correctAnser = document.getElementById('correctAnser').value.split(',').map(id => id.trim());
    
            const updatedQuestion = {
                questionTiltle,
                questionType,
                answers,
                correctAnser
            };
    
            try {
                // Kiểm tra quizId trước khi cập nhật
                if (!this.quizId) {
                    throw new Error("quizId không tồn tại, không thể chuyển hướng.");
                }
    
                // Cập nhật câu hỏi bằng questionId
                await updateQuestion(this.questionId, updatedQuestion);
                
                // Chuyển hướng về danh sách câu hỏi với ID quiz
                window.location.href = `listQuestion.html?id=${this.quizId}`; // Chuyển hướng đúng trang
                alert("Cập nhật câu hỏi thành công!");
    
            } catch (error) {
                alert("Có lỗi xảy ra trong quá trình cập nhật câu hỏi. Vui lòng thử lại.");
                console.error("Lỗi cập nhật câu hỏi:", error);
            }
        });
    },
    
    start: function () {
        this.init();
    }
};

app.start();
