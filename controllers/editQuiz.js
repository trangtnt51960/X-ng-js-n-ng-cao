import { getQuizById, updateQuiz } from "../services/api.js"; // Đảm bảo sử dụng `updateQuiz`

const app = {
    getQuiz: async function() {
        // lấy các tham số từ url, sử dụng để truy xuất id của quiz
        const params = new URLSearchParams(window.location.search);
        // lấy giá trị của tham số id từ url
        const id = params.get('id');
        console.log("ID quiz:", id); // Kiểm tra ID lấy từ URL

        // getQuizByid để lấy thông tin quiz với id tương ứng
        const quiz = await getQuizById(id);

        console.log("Dữ liệu quiz:", quiz); // Kiểm tra dữ liệu quiz đã lấy được
        this.renderForm(quiz);
    },

    renderForm: function(quiz) {
        if (!quiz || !quiz.title) { // Kiểm tra quiz có hợp lệ
            alert("Không tìm thấy quiz với ID đã cho!");
            return; // Ngăn không cho tiếp tục nếu không có dữ liệu
        }

        const content = document.getElementById('content');
        content.innerHTML = `
            <form id="editForm">
                <div class="mb-3">
                    <label for="title" class="form-label">Tên quiz</label>
                    <input type="text" class="form-control" id="title" value="${quiz.title || ''}" required>
                </div>

                <div class="mb-3">
                    <label for="isActive" class="form-label">Trạng thái</label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="isActive" ${quiz.isActive ? 'checked' : ''}>
                        <label class="form-check-label" for="isActive">Kích hoạt</label>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="time" class="form-label">Thời gian (phút)</label>
                    <input type="number" class="form-control" id="time" value="${quiz.time || 0}" required>
                </div>

                <div class="mb-3">
                    <label for="description" class="form-label">Mô tả</label>
                    <textarea class="form-control" id="description" rows="3" required>${quiz.description || ''}</textarea>
                </div>

                <button type="submit" class="btn btn-primary">Cập nhật</button>
            </form>
        `;
        
        // Xử lý sự kiện submit cho form
        const form = document.getElementById('editForm');
        form.addEventListener('submit', async (event) => {

            event.preventDefault(); // ngăn chặn  hành ddoognj mặc định của form(tải lại trang)

            const updatedData = { // tạo đối tượng chứa thông tin mà người dùng đã nhập
                title: document.getElementById('title').value,
                isActive: document.getElementById('isActive').checked,
                time: parseInt(document.getElementById('time').value), // Chuyển đổi về số nguyên
                description: document.getElementById('description').value
            };

            // Gọi API để cập nhật quiz
            await updateQuiz(quiz.id, updatedData); // gọi hàm updateQuiz với id của quiz và dữ liệu đã cập nhật
            window.location.href = 'lisQuiz.html'; // Đường dẫn đến trang danh sách quiz của bạn

            alert("Cập nhật thành công!");
            // Quay lại trang danh sách quiz
        });
    },
    start: function(){
        this.getQuiz();
    }
};

app.start();
