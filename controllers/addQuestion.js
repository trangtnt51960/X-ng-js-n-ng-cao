import { addQuestions } from '../services/api.js';

const app = {
    // Hàm render câu hỏi mới
    renderQuestion: function (type = 1) {
        const currentQuestion = document.querySelectorAll('.question_item')?.length + 1 || 1;
        const listQuestion = document.getElementById('list_question');

        const divElement = document.createElement('div');
        divElement.classList = 'question_item border border-2 rounded p-4 mb-2';
        divElement.innerHTML = `
            <h4 class="question_number">Câu hỏi: ${currentQuestion}</h4>
            <div class="mb-3">
                <label for="question_${currentQuestion}" class="form-label">Nội dung câu hỏi</label>
                <textarea class="form-control" id="question_content_${currentQuestion}" rows="3"></textarea>
            </div>
            <div class="answer_items mt-3">
                ${this.renderAnswers(currentQuestion, type)}
            </div>
        `;
        listQuestion.appendChild(divElement);
        const contentQuestion = document.getElementById(`question_content_${currentQuestion}`);
        contentQuestion?.focus();
        contentQuestion?.scrollIntoView({ behavior: 'smooth' });
    },

    // Hàm render các đáp án của câu hỏi
    renderAnswers: function (questionNumber, type) {
        const answerTypes = type == 1 ? 'radio' : 'checkbox';
        let answerItemsHTML = '';
        for (let i = 1; i <= 4; i++) {
            answerItemsHTML += `
                <div class="form-check fs-5 mb-3">
                    <input class="form-check-input border border-2 border-primary" role="button" type="${answerTypes}" name="question_${questionNumber}" id="check_${questionNumber}_${i}" >
                    <div class="mb-3">
                        <input type="text" class="form-control" id="answer_${questionNumber}_${i}" placeholder="Nhập nội dung đáp ${i}">
                    </div>
                </div>
            `;
        }
        return answerItemsHTML;
    },

    // Xử lý khi nhấn nút Add Question
    handleAdd: function () {
        document.getElementById('btn_add').addEventListener('click', () => {
            const type = document.getElementById('question_type').value; // Lấy giá trị của type từ dropdown
            this.renderQuestion(type); // Gọi hàm render câu hỏi mới
        });
    },

    // Xử lý khi nhấn nút Submit
    handleSubmit: function () {
        document.getElementById('btn_submit').addEventListener('click', async () => {
            const listData = document.querySelectorAll('.question_item');
            const searchParam = new URLSearchParams(window.location.search);
            let idQuiz = searchParam.has("id") ? searchParam.get("id") : null;

            const data = [];
            for (let i = 0; i < listData.length; i++) {
                const questionContent = document.getElementById(`question_content_${i + 1}`);
                const checks = listData[i].querySelectorAll('input[type="radio"], input[type="checkbox"]');
                const answerlist = listData[i].querySelectorAll('input[type="text"]');

                const isCheck = this.validate(questionContent, checks, answerlist);
                if (!isCheck) break;

                const type = checks[0].type === 'radio' ? 1 : 2; // Xác định type dựa trên loại input
                const item = {
                    questionTiltle: questionContent.value,
                    answers: [],
                    quizId: idQuiz,
                    type: type,
                    correctAnser: []
                };

                answerlist.forEach((ans, index) => {
                    item.answers.push({
                        id: (index + 1).toString(),
                        answerTitle: ans.value
                    });
                });

                checks.forEach((check, index) => {
                    if (check.checked) {
                        item.correctAnser.push((index + 1).toString());
                    }
                });

                data.push(item);
            }

            if (data.length === listData.length) {
                await addQuestions(data);
                window.location = 'listQuiz.html';
                alert("Thêm thành công");
            }
        });
    },

    // Kiểm tra dữ liệu hợp lệ
    validate: function (questionContent, checks, answerlist) {
        if (!questionContent.value.trim()) {
            alert("Cần nhập nội dung câu hỏi");
            questionContent.focus();
            return false;
        }

        let isCheckRadio = false;
        for (let i = 0; i < checks.length; i++) {
            if (checks[i].checked) {
                isCheckRadio = true;
                break;
            }
        }

        if (!isCheckRadio) {
            alert("Cần lựa chọn đáp đúng");
            checks[0].focus();
            return false;
        }

        for (let i = 0; i < answerlist.length; i++) {
            if (!answerlist[i].value.trim()) {
                alert("Cần nhập đầy đủ đáp án");
                answerlist[i].focus();
                return false;
            }
        }

        return true;
    },

    // Bắt đầu ứng dụng
    start: function () {
        this.handleAdd(); // Gọi hàm xử lý sự kiện cho nút Add Question
        this.handleSubmit(); // Gọi hàm xử lý sự kiện cho nút Submit
    }
};

app.start();
