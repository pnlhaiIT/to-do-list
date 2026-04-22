$(document).ready(function () {
    let todoList = JSON.parse(localStorage.getItem("todos")) || [];

    function autoLoad() {
        if (todoList.length > 0) {
            for (let i = 0; i < todoList.length; i++) {
                const checkedAttr = todoList[i].done ? "checked" : "";
                $("tbody tr:last").before(`
                    <tr id="${todoList[i].id}">
                    <td class="col-9 cv">${todoList[i].name}</td>
                    <td class="col-3 status">
                        <label class="form-check">
                            <input class="form-check-input" type="checkbox" ${checkedAttr}/>
                                Done
                        </label></td></tr>
                    `);
            }
        }
        return;
    }

    function themCV() {
        let addCV = $("#inputCV").val().trim();
        if (addCV === "" || !addCV) {
            alert("Mịe mày!! Nhập tên công việc mới thêm được!");
            $("#inputCV").focus();
            return;
        }
        for (let i = 0; i < todoList.length; i++) {
            if (addCV === todoList[i].name) {
                alert(`Đã có task "${addCV}" rồi!`);
                return;
            }
        }
        const id = "todo-" + Date.now();       // todo-1234567
        todoList.unshift({ id, name: addCV, done: false });  //lưu id | tên | trạng thái
        localStorage.setItem("todos", JSON.stringify(todoList));

        $("tbody tr:first").before(`
            <tr id="${id}">
            <td class="col-9 cv">${addCV}</td>
                    <td class="col-3 status">
                        <label class="form-check">
                            <input class="form-check-input" type="checkbox" />
                                Done
                        </label></td></tr>
            `);
        $("#inputCV").val("");
        return;
    }

    function checkDone() {
        $("tbody").on("change", ".form-check-input", function () {
            let rowID = $(this).closest("tr").attr("id");
            let x = todoList.find(n => n.id === rowID);
            if (!x) {
                alert("Lỗi localStorage mịe rồi!");
                return;
            }
            x.done = $(this).is(":checked");
            localStorage.setItem("todos", JSON.stringify(todoList));
            return;
        });
    }

    function xoaCV() {
        let removeCV = $("#inputCV").val().trim();
        if (removeCV === "" || !removeCV) {
            alert("Chưa nhập tên task xóa kiểu chóa gì!!");
            $("#inputCV").focus();
            return;
        }
        const idx = todoList.findIndex(t => t.name === removeCV);
        if (idx === -1) {
            alert("Không tìm thấy công việc để xóa!");
            return;
        }
        const IDxoa = todoList[idx].id;
        todoList.splice(idx, 1) //xóa 1 phần tử từ index idx
        localStorage.setItem("todos", JSON.stringify(todoList));
        $(`#${IDxoa}`).remove();
        $("#inputCV").val("");
        return;
    }

    function clear() {
        let sure = confirm("Bạn chắc chắn xóa hết?");
        if (!sure) {
            return;
        } else {
            todoList = [];
            localStorage.setItem("todos", JSON.stringify(todoList));
            $("tbody tr").not(".input-row").remove();
            return;
        }
    }

    function refreshStatus() {
        let sure = confirm("Bạn muốn refresh toàn bộ trạng thái??");
        if (!sure) {
            return;
        }
        $(".form-check-input").prop("checked", false);
        todoList.forEach(element => {
            element.done = false;
        });
        localStorage.setItem("todos", JSON.stringify(todoList));
        return;
    }

    autoLoad();
    $("#xoa").on("click", xoaCV);
    $("#them").click(themCV);
    checkDone();
    $("#clear").click(clear);
    $("#refresh").on("click", refreshStatus);
});