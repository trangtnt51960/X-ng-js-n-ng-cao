import { getQuizById, getQuestionsByIdQuiz, promptForUserName, calculateCompletionTime, saveScore, getScores } from '../services/api.js';

var listQuestion = [];
var listAnswerSubmit = [];
const btnSubmit = document.getElementById('btn_submit');
var isSubmit = false;
var startTime;

const app = {
    getQuizandQuestion: async function() {
        const searchParam = new URLSearchParams(window.location.search);
        if (searchParam.has('id')) {
            const id = searchParam.get('id');
            const dataQuiz = await getQuizById(id);
            this.countDown(dataQuiz.time);
            this.renderQuizInfo(dataQuiz);
            listQuestion = await getQuestionsByIdQuiz(id);
            this.renderListQuestion(listQuestion);
        }
    },
    renderQuizInfo: function(data) {
        document.getElementById('quiz_heading').innerHTML = data.title;
        document.getElementById('quiz_description').innerHTML = data.description;
    },
    renderListQuestion: function(list) {
        list = this.random(list);
        const questionItem = list?.map((item, index) => {
            const listAnswers = this.renderAnswers(item.answers, item.type, item.id);
            return `
                <div class="question_item border border-2 rounded p-4 mb-2">
                    <h4 class="question_number" id="${item.id}">Câu hỏi: ${index + 1}</h4>
                    <h5 class="question_title">
                        ${item.questionTiltle}
                    </h5>
                    <div class="answer_items mt-3">
                        ${listAnswers}
                    </div>
                </div>
            `;
        }).join("");
        document.getElementById('question_container').innerHTML = questionItem;
    },
    renderAnswers: function(listAnswers, type, idQuestion) {
        listAnswers = this.random(listAnswers);
        return listAnswers?.map((ans, index) => {
            return `
                <div class="form-check fs-5 mb-3">
                    <input class="form-check-input" 
                           type="${type == 1 ? 'radio' : 'checkbox'}" 
                           name="question_${idQuestion}" 
                           id="answer_${idQuestion}_${ans.id}" 
                           data-idquestion="${idQuestion}"
                           data-idanswers="${ans.id}">
                    <label class="form-check-label" for="answer_${idQuestion}_${ans.id}">
                        ${ans.answerTitle}
                    </label>
                </div>
            `;
        }).join("");
    },
    random: function(array) {
        return array.sort(() => Math.random() - Math.random());
    },
    handleSubmit: function() {
        btnSubmit.addEventListener('click', () => {
            if (confirm("Bạn có chắc chắn nộp bài không?")) {
                isSubmit = true;
                this.handleSubmitForm();
            }
        });
    },
    handleSubmitForm: function() {
        const listAnswersUser = document.querySelectorAll('.answer_items');
        listAnswersUser.forEach((answers) => {
            const data = {
                idQuestion: '',
                idAnswers: []
            };
            const inputs = answers.querySelectorAll('input');
            inputs?.forEach((ans) => {
                if (ans.checked) {
                    data.idQuestion = ans.dataset.idquestion;
                    data.idAnswers.push(ans.dataset.idanswers);
                }
            });
            if (data.idAnswers.length > 0)
                listAnswerSubmit.push(data);
        });

        this.checkAnswers(listAnswerSubmit);
    },
    checkAnswers: async function(listAnswerSubmit) {
        const listStatus = [];
        let countRight = 0;
    
        listAnswerSubmit.forEach((ansUser) => {
            const findQuestion = listQuestion.find((ques) => ques.id == ansUser.idQuestion);
            const isCheck = this.checkEqual(ansUser.idAnswers, findQuestion.correctAnser);
            if (isCheck) countRight++;
            listStatus.push({
                idQuestion: findQuestion.id,
                status: isCheck
            });
        });
    
        this.renderStatus(listStatus);
        alert(`Bạn trả lời đúng ${countRight}/${listQuestion.length}`);
    
        // Yêu cầu người dùng nhập tên và lưu điểm số
        promptForUserName(countRight, async (userName) => {
            const timeTaken = await calculateCompletionTime(startTime); 
            await saveScore({ name: userName, score: countRight, timeTaken });
    
            // Gọi hàm getScores để lấy danh sách điểm số và cập nhật bảng xếp hạng
            const scores = await getScores(); 
            console.log(scores); // Xem dữ liệu trả về
    
            this.renderLeaderboard(scores); 
        });
    },
    
    renderLeaderboard: function(scores) {
        const leaderboardContainer = document.getElementById('leaderboard'); 
        leaderboardContainer.innerHTML = ''; // Xóa nội dung cũ

        // Sắp xếp điểm số từ cao xuống thấp
        scores.sort((a, b) => b.score - a.score);


        scores.forEach((item, index) => {
            leaderboardContainer.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.score}</td>
                    <td>${item.timeTaken} giây</td>
                </tr>
            `;
        });
    },
    checkEqual: function(arr1, arr2) {
        arr1 = arr1.sort();
        arr2 = arr2.sort();
        return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
    },
    renderStatus: function(listStatus) {
        listStatus.forEach((item) => {
            const title = document.getElementById(item.idQuestion);
            title.innerHTML += `${item.status ? `<span class="badge text-bg-success">Đúng</span>` : `<span class="badge text-bg-danger">Sai</span>`}`;
        });
    },
    countDown: function(time) {
        startTime = new Date();
        const that = this;

        function handleTime() {
            const minute = Math.floor(time / 60);
            const second = time % 60;

            const timeElement = document.getElementById("timer");
            timeElement.innerHTML = `${minute < 10 ? '0' : ''}${minute}:${second < 10 ? '0' : ''}${second}`;

            time--;
            if (isSubmit) {
                clearInterval(timeInter);
            }
            if (time < 0) {
                that.handleSubmitForm();
                clearInterval(timeInter);
                timeElement.innerHTML = `Hết thời gian`;
            }
        }
        const timeInter = setInterval(handleTime, 1000);
    },
    reset: function() {
        const btnReset = document.getElementById("btn_reset");
        btnReset.addEventListener("click", () => {
            if (window.confirm("Bạn có muốn làm lại không?")) {
                window.location.reload();
            }
        });
    },
    start: function() {
        this.getQuizandQuestion();
        this.handleSubmit();
        this.reset();
    }
}

app.start();
