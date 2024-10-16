import { getQuestionsByIdQuiz, deleteQuestion } from '../services/api.js';

const app = {
    renderListQuestions: async function () {
        // Lấy ID quiz từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const idQuiz = urlParams.get('id'); // Đảm bảo sử dụng đúng tên tham số

        // Lấy danh sách câu hỏi theo ID quiz
        const questions = await getQuestionsByIdQuiz(idQuiz);
        console.log("Danh sách câu hỏi:", questions); // Kiểm tra dữ liệu

        // Kiểm tra nếu không có câu hỏi nào
        if (!Array.isArray(questions) || questions.length === 0) {
            document.querySelector("tbody").innerHTML = "<tr><td colspan='5'>Không có câu hỏi nào.</td></tr>";
            return;
        }

        // Hiển thị danh sách câu hỏi
        document.querySelector("tbody").innerHTML = questions.map((item, index) => {
            // Kiểm tra tính hợp lệ của các thuộc tính
            if (!item.answers || !Array.isArray(item.answers)) {
                console.error("Đáp án không hợp lệ cho câu hỏi:", item);
                return ''; // Trả về chuỗi rỗng nếu không có đáp án hợp lệ
            }

            // Tạo danh sách các đáp án
            const answersList = item.answers.map(answer => `
                <li>${answer.answerTitle}</li>
            `).join('');

            // Tạo danh sách các đáp án đúng dựa trên ID
            const correctAnswers = item.correctAnser ? item.correctAnser.map(id => {
                const correctAnswer = item.answers.find(answer => answer.id === id);
                return correctAnswer ? correctAnswer.answerTitle : ''; // Lấy title của đáp án đúng
            }).join(', ') : 'Không có đáp án đúng';

            return `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${item.questionTiltle || 'Không có tiêu đề'}</td>
                    <td>
                        <ul>
                            ${answersList} 
                        </ul>
                    </td>
                    <td>${correctAnswers}</td> 
                    <td>
                        <button data-id="${item.id}" class="btn_delete btn btn-danger">Xóa</button>
                        <button data-id="${item.id}" class="btn_edit btn btn-warning">Sửa</button>
                    </td>
                </tr>
            `;
        }).join(''); // Chuyển đổi mảng thành chuỗi
        
        this.handleDeleteQuestion();
        this.handleEditQuestion(); // Thêm xử lý cho nút Sửa
    },
    
    handleDeleteQuestion: async function() {
        const btnDelete = document.querySelectorAll('.btn_delete');
        btnDelete.forEach((item) => {
            item.addEventListener('click', async () => {
                const id = item.getAttribute("data-id");
                if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này không?")) {
                    await deleteQuestion(id); // Chờ cho đến khi xóa hoàn tất
                    this.renderListQuestions(); // Cập nhật lại danh sách
                }
            });
        });
    },
    
    handleEditQuestion: function() {
        const btnEdit = document.querySelectorAll('.btn_edit');
        const urlParams = new URLSearchParams(window.location.search);
        const quizId = urlParams.get('id'); // Lấy quizId từ URL
        btnEdit.forEach((item) => {
            item.addEventListener('click', () => {
                const id = item.getAttribute("data-id");
                console.log(id);
                
                // Chuyển hướng đến trang chỉnh sửa với id câu hỏi và quizId đúng
                window.location.href = `editListQuestion.html?id=${id}&quizId=${quizId}`;
            });
        });
    },
    
    start: function () {
        this.renderListQuestions(); // Gọi hàm để hiển thị danh sách câu hỏi
    }
}

document.addEventListener('DOMContentLoaded', () => {
    app.start();
});
