import { BaseController } from './BaseController';
import { TodoView } from "../view/TodoView";
import { createUUID } from "../utils/UUID";
import { writeTodoToDatabase } from "../networking/FirebaseUtils";
import { fetchDataFromDatabase } from "../networking/FirebaseUtils";

export class TodoController extends BaseController {

    constructor() {
        super();

        // Properties
        this.todoContainer = document.querySelector('.todo-main');
        this.todoInput = document.querySelector('.todo-input');
        this.processInputBtn = document.querySelector('.input-group-append .btn');
        this.cardList = document.querySelector('.card-list');

        // Methods
        this.fetchData = (user) => {
            fetchDataFromDatabase(user, (err, value) => {
                if (err) {
                    // Handle Error
                } else {
                    $('.spinner-container').fadeOut('slow');
                    $('.spinner-border').fadeOut('slow', () => {
                        $('.spinner-container').remove()
                        $('.card-list').fadeIn()
                    });
                    $('.card-list').append(value.getHtml())
                }
            })
        }

        super.openView = (value) => {
            if (value) {
                this.todoContainer.classList.remove('d-none');
                document.querySelector('.card-list').classList.remove('d-none');
                document.querySelector('.navbar .navbar-brand').classList.remove('d-none');
                document.querySelector('.navbar .navbar').classList.remove('d-none');
            } else {
                this.todoContainer.classList.add('d-none');
                document.querySelector('.card-list').classList.add('d-none');
                document.querySelector('.navbar .navbar-brand').classList.add('d-none');
                document.querySelector('.navbar .navbar').classList.add('d-none');
                $('.card-list').empty()
            }
        }

        const addToDo = () => {
            const todoObj = {
                todo: {
                    value: this.todoInput.value
                },
                timestamp: {
                    value: Date.now()
                },
                complete: {
                    value: false
                },
                todoUUID: createUUID()
            }
            const todoView = new TodoView(todoObj);
            $(this.cardList).prepend(todoView.getHtml());
            writeTodoToDatabase(todoObj, (value) => {
                $('.spinner-container').remove();
                $(this.cardList).fadeIn('fast');
            });
            $(this.todoInput).val("");
        }
        this.processInputBtn.addEventListener('click', addToDo)
    }
}