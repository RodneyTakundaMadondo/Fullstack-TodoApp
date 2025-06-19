$(function () {
    const el = $("#items")[0];
    const liElements = document.querySelectorAll(".task-listitem");
    const sortable = Sortable.create(el);

    let noteAmount = document.querySelector(".total-active-notes");
    let clearCompleted = document.querySelector(".clear-completed");
    clearCompleted.addEventListener("click", RemoveAllCompleted);

    $('.addTask').on("change", function () {
        if ($(this).is(":checked")) {
            const task = $(".addTaskInput").val().trim();
            if (!task) return;
            fetch('/api/TaskWorker', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(task)
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Something went wrong");
                    }

                    $(".addTaskInput").val("");
                    $(".addTask").prop('checked', false);
                    return res.json();
                })
                .then(data => {
                    let listItem = document.createElement("li");
                    listItem.classList.add("flex", "justify-between", "items-center", "task-listitem");
                    listItem.innerHTML = `
                    <div class="flex  items-center check_task">
									<label class="  custom-checkbox" for="${data.toDoTaskId}">
									<input class="markComplete checkbox-input" type="checkbox" name="CheckComplete" id="${data.toDoTaskId}" data-id="${data.toDoTaskId}">
									<span class="checkbox-box"></span>
								     </label>
								     <p class="task-text">${data.taskDescription}</p>
								</div>

								<button data-delete="${data.toDoTaskId}" id="delete_${data.toDoTaskId}" class="delete-btn"><img src="/images/icon-cross.svg" alt="Delete" /></button>
                    `;
                    el.appendChild(listItem);
                    checkboxHandler();
                    const deleteBtn = listItem.querySelector(".delete-btn");
                    deleteBtn.addEventListener("click", (e) => { deleteItems(e) })
                    return fetch("/api/TaskWorker/get-active");

                })
                .then(res => res.json())
                .then(data => {
                    let activeNotes = data.length;
                    noteAmount.innerHTML = activeNotes;
                })
                .catch(error => {
                    console.error("Error", error)
                })
        }
    });

    liElements.forEach((li) => {
        const deleteBtn = li.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", (event) => {
            let taskId = event.currentTarget.dataset.delete;
            fetch('/api/TaskWorker/', {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(taskId)
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Something went wrong");
                    }
                    let parent = deleteBtn.parentElement;
                    parent.remove();
                    return fetch("/api/TaskWorker/get-active");
                }).then(res => res.json())
                .then(data => {
                    let activeNotes = data.length;
                    noteAmount.innerHTML = activeNotes;
                })

        })

    })

    function deleteItems(e) {
        let taskId = e.currentTarget.dataset.delete;
        let parent = e.currentTarget.parentElement;
        fetch('/api/TaskWorker/', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskId)
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Something went wrong");
                }

                parent.remove();
                return fetch("/api/TaskWorker/get-active");
            }).then(res => res.json())
            .then(data => {
                let activeNotes = data.length;
                noteAmount.innerHTML = activeNotes;
            })
    }

    async function RemoveAllCompleted(e) {

        try {
            const response = await fetch("/api/TaskWorker/remove-completed", {
                method: "DELETE"
            });

            if (!response) {
                throw new Error("Failed to clear completed tasks");
            }
            console.log("Cleared successfully")

            const response2 = await fetch("/api/TaskWorker/");
            if (!response2) {
                throw new Error("Could not get data");
            }
            const data = await response2.json();
            el.innerHTML = "";
            data.forEach(noteData => {

                let listItem = document.createElement("li");
                listItem.classList.add("flex", "justify-between", "items-center", "task-listitem");
                listItem.innerHTML = `
                    <div class="flex  items-center check_task">
									<label class="  custom-checkbox" for="${noteData.toDoTaskId}">
									<input class="markComplete checkbox-input " type="checkbox" name="CheckComplete" id="${noteData.toDoTaskId}" ${noteData.isActive ? "" : "checked"} data-id="${noteData.toDoTaskId}">
									<span class="checkbox-box"></span>
								     </label>
								     <p class="task-text ${noteData.isActive ? "" : "complete"} ">${noteData.taskDescription}</p>
								</div>

								<button data-delete="${noteData.toDoTaskId}" id="delete_${noteData.toDoTaskId}" class="delete-btn"><img src="/images/icon-cross.svg" alt="Delete" /></button>
                    `;

                el.appendChild(listItem);

                const deleteBtn = listItem.querySelector(".delete-btn");
                deleteBtn.addEventListener("click", () => { deleteItems(e) })
                checkboxHandler();
            })

        } catch (err) {
            console.error("Delete error", err)
        }


    }

    function checkboxHandler() {
        let checkComplete = document.querySelectorAll(".markComplete");
        checkComplete.forEach(function (checkbox) {
            let taskText = checkbox.parentElement.nextElementSibling;
            if (checkbox.checked) {
                taskText.classList.add("complete")
            } else {
                taskText.classList.remove("complete");
            }
            checkbox.addEventListener("change", () => {

                let dto = {};
                if (checkbox.checked) {

                    taskText.classList.add("complete")
                    dto = {
                        id: checkbox.dataset.id,
                        isActive: false
                    };

                } else {
                    taskText.classList.remove("complete");
                    dto = {
                        id: checkbox.dataset.id,
                        isActive: true
                    };


                }
                changeActiveState(dto)

            })
        })
    }
    checkboxHandler();



    function changeActiveState(dto) {
        fetch("/api/TaskWorker", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        }).then(res => {
            if (!res.ok) {
                throw new Error("Something went wrong");
            }
            return fetch("/api/TaskWorker/get-active");
        }).then(res => res.json())
            .then(data => {
                let activeNotes = data.length;
                noteAmount.innerHTML = activeNotes;
            })
    }


    const filterBtns = document.querySelectorAll(".filter-btns");
    filterBtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            filterBtns.forEach((allbtns) => {
                allbtns.classList.remove("active")
            })
            btn.classList.add("active");
            let btnAction = event.currentTarget.dataset.filter;

            fetch("/api/TaskWorker")
                .then(res => res.json())
                .then(data => {
                    if (btnAction.toLowerCase().includes("all")) {
                        filterNotes(data)
                    } else if (btnAction.toLowerCase().includes("active")) {
                        let activeArr = data.filter(task => task.isActive);
                        filterNotes(activeArr);
                    }
                    else if (btnAction.toLowerCase().includes("completed")) {
                        let completedArr = data.filter(task => !task.isActive);
                        filterNotes(completedArr);
                    }
                })

        })
    })

    function filterNotes(array) {
        el.innerHTML = "";
        array.forEach(noteData => {

            let listItem = document.createElement("li");
            listItem.classList.add("flex", "justify-between", "items-center", "task-listitem");
            listItem.innerHTML = `
                    <div class="flex  items-center check_task">
									<label class="  custom-checkbox" for="${noteData.toDoTaskId}">
									<input class="markComplete checkbox-input " type="checkbox" name="CheckComplete" id="${noteData.toDoTaskId}" ${noteData.isActive ? "" : "checked"} data-id="${noteData.toDoTaskId}">
									<span class="checkbox-box"></span>
								     </label>
								     <p class="task-text ${noteData.isActive ? "" : "complete"} ">${noteData.taskDescription}</p>
								</div>

								<button data-delete="${noteData.toDoTaskId}" id="delete_${noteData.toDoTaskId}" class="delete-btn"><img src="/images/icon-cross.svg" alt="Delete" /></button>
                    `;

            el.appendChild(listItem);

            const deleteBtn = listItem.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", () => { deleteItems(e) })
            checkboxHandler();
        })
    }

    const taskContainer = document.querySelector(".task-container");
    const filterBtnContainer = document.querySelector(".filter-btn-container");

    // function setFilterBtnContPosition() {
    //     const parentHeight = taskContainer.offsetHeight;
    //     filterBtnContainer.style.top = `${parentHeight + 40}px`;
    // }
    // window.addEventListener("load", setFilterBtnContPosition);
    // window.addEventListener("resize", setFilterBtnContPosition);

    const observer = new ResizeObserver(() => {
        const parentHeight = taskContainer.offsetHeight;
        filterBtnContainer.style.top = `${parentHeight + 40}px`;
    });

    observer.observe(taskContainer);

    const themeToggle = document.querySelector(".theme-mode");
    const themeImg = document.querySelector(".theme-img");
    const headerImg = document.querySelector(".header-image");
    const headerImgSource = document.querySelector(".header-image-source");


    themeToggle.addEventListener("click", () => {

        let currentTheme = document.body.className;
        if (currentTheme == "dark") {
            document.body.className = "light"
        } else {
            document.body.className = "dark"
        }
       
      
        
        sourceControl(themeImg, "/images/icon-moon.svg", "/images/icon-sun.svg", "src");
        sourceControl(headerImg, "/images/bg-mobile-light.jpg", "/images/bg-mobile-dark.jpg", "src")
        sourceControl(headerImgSource, "/images/bg-desktop-light.jpg", "/images/bg-desktop-dark.jpg", "srcset")

        const chosenTheme = document.body.classList.contains("dark") ? "dark" : "light";

        let dto = {
            theme: chosenTheme
        }

        fetch("/api/TaskWorker/set-theme", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)

        }).then(res => { if (!res.ok) throw new Error("Something went wrong") }).catch(err => console.error(err))


    })
    SetTheme();

    
async function SetTheme() {
    try {
        const res = await fetch("/api/TaskWorker/get-settings");
        const data = await res.json();

        document.body.classList = "";
        document.body.className = data.theme;
        sourceControl(themeImg, "/images/icon-moon.svg", "/images/icon-sun.svg", "src");
        sourceControl(headerImg, "/images/bg-mobile-light.jpg", "/images/bg-mobile-dark.jpg", "src")
        sourceControl(headerImgSource, "/images/bg-desktop-light.jpg", "/images/bg-desktop-dark.jpg", "srcset")

    } catch (err) {
        console.error("Failed to load data", err);
    }

}


});


function sourceControl(element, imageForLight, imageForDark, attribute) {

    if (document.body.classList.contains("dark")) {
        element.setAttribute(`${attribute}`, `${imageForDark}`)
    } else if (document.body.classList.contains("light")) {
        element.setAttribute(`${attribute}`, `${imageForLight}`)
    }
}