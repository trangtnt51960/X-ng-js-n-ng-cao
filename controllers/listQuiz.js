import {getAllQuiz, deleteQuiz} from '../services/api.js';
 

const app = {
    renderListQuiz: async function(){
        // 1. Lấy danh sách quiz
        const data = await getAllQuiz();
        console.log(data);
        //2 Duyệt mảng data và hiển thị tr
        document.querySelector("tbody").innerHTML = data.map((item,index)=>{
            return`
                  <tr>
                    <th scope="row">${index+1}</th>
                    <td>${item.title}</td>
                    <td>${item.isActive ? 
                            `<span class="badge text-bg-success">Kích hoạt</span>`
                            :
                           `<span class="badge text-bg-danger">Chưa kích hoạt</span>`
                        }</td>
                    <td>${item.time}</td>
                    <td>${item.description}</td>
                    <td>
                        <button data-id="${item.id}" class="btn_delete btn btn-danger">Xóa</button>                    
                        <button data-id="${item.id}" class="btn_edit btn btn-warning">Sửa</button>                    
                        <button data-id="${item.id}" class="btn_list btn btn-success">List Question</button>                    
                    </td>
                    </tr>
            `
        })
        this.handleDelete();
        this.handleEditQuiz();
        this.handleListQuestionQuiz();
        


    },
    handleDelete: function(){
        // tạo nút button

        // lấy danh sách các nút xóa

        const btnDelete = document.querySelectorAll('.btn_delete');
        // duyệt qua mảng và khai báo sự kiện click nút xóa
        btnDelete.forEach((item)=>{
            item.addEventListener('click', ()=>{
                const id = item.getAttribute("data-id")
                if(window.confirm("Bạn có chắc chắn muốn xóa quiz này không ?")){
                    deleteQuiz(id);
                }
            })
        })

    },
    handleEditQuiz: function(){
        const btnEdits = document.querySelectorAll('.btn_edit');
        btnEdits.forEach((item)=>{
            item.addEventListener('click', ()=>{
                const id = item.getAttribute("data-id");
                console.log(id);
                
                // chuyển hướng đến trang chỉnh sửa với id quiz
                window.location.href = `editQuiz.html?id=${id}`;
            })
        })

    },
    handleListQuestionQuiz: function(){
        const btnListQuestionQuiz = document.querySelectorAll('.btn_list');
        btnListQuestionQuiz.forEach((item)=>{
            item.addEventListener('click', ()=>{
                const id = item.getAttribute("data-id");
                console.log(id);
                window.location.href = `listQuestion.html?id=${id}`;
                
            })
        })

    },
    start: function(){
        this.renderListQuiz();

    }
}
app.start();