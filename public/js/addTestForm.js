"use strict";

(function () {

    /**
     * @constructor
     */
    function AddTestForm() {
        this._questionsBlock = document.querySelector(".add-test-form__questions");
        this._questions = document.querySelectorAll(".question-block");
        this._addQuestionButton = document.getElementById("add-question-btn");

        var self = this;

        this._addQuestionButton.addEventListener("click", function (event) {
            event.preventDefault();

            var questionElement = self._createQuestion();

            self._questionsBlock.appendChild(questionElement);
            self._questions = self._questionsBlock.querySelectorAll(".question-block");
        });

        this._onAddAnswerClick = this._onAddAnswerClick.bind(this);
        this._onDeleteAnswerClick = this._onDeleteAnswerClick.bind(this);
        this._onDeleteQuestionClick = this._onDeleteQuestionClick.bind(this);
        this._onAnswerTypeChange = this._onAnswerTypeChange.bind(this);
    }


    /**
     * Метод используется для валидации формы. Валидация происходит по трем критериям:
     *   1) Проверка на пустоту поля с вопросом;
     *   2) Проверка на пустоту поля с ответом (или нескольких полей для тестовых вопросов);
     *   3) Для тестовых вопросов проверяется наличие хотя бы одного ответа, отмеченного как правильный
     * @returns {{isValid: boolean, errorFields: Array}} - объект с признаком результата валидации (isValid)
     *     и массивом названий полей, которые не прошли валидацию (errorFields)
     */
    AddTestForm.prototype.validate = function () {
        var isValid = true;
        /**
         * @type {Array} errorFields
         * @type {number} errorFields[].questionNumber - номер вопроса, в котором валидация не пройдена
         * @type {string} errorFields[].errorPlace - место, где валидация не пройдена. Принимает значение question если
         *     валидация не прошла на проверке вопроса и принимает значение answer если валидация не прошла на
         *     проверке ответа
         * @type {Object} errorFields[].errorType - дополнительное поле, которое присутствует только если
         *     errorPlace === "answer"
         * @type {string} errorFields[].errorType.type - тип ошибки ответа. Принимает значение empty если найдено
         *     незаполненное поле ответа и принимает значение noRight если в тестовом вопросе не отмечено ни одного
         *     правильного ответа
         * @type {Array} errorFields[].errorType.wrongFields - массив номеров ответов, которые не прошли валидацию.
         *     Присутствует только если type === "empty"
         */
        var errorFields = [];

        this._questions.forEach(function (question) {
            var questionValue = question.querySelector(".question-block__question textarea").value;

            if (questionValue === "") {
                isValid = false;
                errorFields.push({
                    questionNumber: Number(question.getAttribute("data-question")),
                    errorPlace: "question"
                });
                return;
            }

            var questionType = question.querySelector(".question-block__answer-type select").value;

            if (questionType === "test-answer") {
                var answers = question.querySelectorAll(".answer-block__item input[type=text]");
                var answersValues = Array.prototype.map.call(answers, function (answer) {
                    return answer.value;
                });
                var wrongAnswers = [];
                
                answersValues.forEach(function (answerValue, answerValueIndex) {
                    if (answerValue === "") {
                        isValid = false;
                        wrongAnswers.push(Number(answers[answerValueIndex].getAttribute("data-answer")));
                    }
                });
                
                if (wrongAnswers.length !== 0) {
                    errorFields.push({
                        questionNumber: Number(question.getAttribute("data-question")),
                        errorPlace: "answer",
                        errorType: {
                            type: "empty",
                            wrongFields: wrongAnswers
                        }
                    });
                    return;
                }
                
                var checkboxes = question.querySelectorAll(".answer-block__item input[type=checkbox]");
                
                var haveRightAnswer = Array.prototype.some.call(checkboxes, function (checkbox) {
                    return checkbox.checked;
                });
                
                if (!haveRightAnswer) {
                    isValid = false;
                    errorFields.push({
                        questionNumber: Number(question.getAttribute("data-question")),
                        errorPlace: "answer",
                        errorType: {
                            type: "noRight"
                        }
                    });
                    return;
                }
            }
            if (questionType === "handle") {
                var answer = question.querySelector(".answer-block__item textarea").value;

                if (answer === "") {
                    isValid = false;
                    errorFields.push({
                        questionNumber: Number(question.getAttribute("data-question")),
                        errorPlace: "answer",
                        errorType: {
                            type: "empty"
                        }
                    });
                }
            }
        });
        
        return { isValid: isValid, errorFields: errorFields };
    };


    /**
     * Метод создает DOM элемент с тестовым ответом
     * @param {number} answerNumber - индекс ответа в вопросе
     * @returns {Element} - DOM элемент с ответом
     * @private
     */
    AddTestForm.prototype._createTestAnswer = function (answerNumber) {
        var answerBlockItem = document.createElement("div");
        answerBlockItem.classList.add("answer-block__item");
        answerBlockItem.setAttribute("data-answer", String(answerNumber));

        var button = document.createElement("button");
        button.classList.add("answer-block__delete-answer");
        button.setAttribute("data-answer", String(answerNumber));
        button.addEventListener("click", this._onDeleteAnswerClick);

        var id = Math.floor(1 + Math.random() * 999999999);

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "answer" + String(id);

        var label = document.createElement("label");
        label.setAttribute("for", "answer" + String(id));

        var textInput = document.createElement("input");
        textInput.type = "text";
        textInput.placeholder = "Ответ " + String(answerNumber + 1);

        answerBlockItem.appendChild(button);
        answerBlockItem.appendChild(checkbox);
        answerBlockItem.appendChild(label);
        answerBlockItem.appendChild(textInput);

        return answerBlockItem;
    };


    /**
     * Метод создает DOM элемент с ответом, который предполагает ручной ввод
     * @returns {Element} - DOM элемент с ответом
     * @private
     */
    AddTestForm.prototype._createHandleAnswer = function () {
        var answerBlockItem = document.createElement("div");
        answerBlockItem.classList.add("answer-block__item");

        var label = document.createElement("label");
        label.textContent += "Ответ:";

        var textarea = document.createElement("textarea");
        textarea.cols = "30";
        textarea.rows = "10";
        textarea.placeholder = "Введите ответ...";

        answerBlockItem.appendChild(label);
        answerBlockItem.appendChild(textarea);

        return answerBlockItem;
    };


    /**
     * Метод создает DOM элемент с вопросом (по умолчанию вопрос тестовый)
     * @returns {Element} - DOM элемент с вопросом
     * @private
     */
    AddTestForm.prototype._createQuestion = function () {
        var questionBlock = document.createElement("div");
        questionBlock.classList.add("question-block");
        questionBlock.setAttribute("data-question", String(this._questions.length));

        var deleteQuestionButton = document.createElement("button");
        deleteQuestionButton.classList.add("question-block__delete-question");
        deleteQuestionButton.setAttribute("data-question", String(this._questions.length));
        deleteQuestionButton.addEventListener("click", this._onDeleteQuestionClick);

        var h2 = document.createElement("h2");
        h2.classList.add("question-block__title");
        h2.textContent = "Вопрос " + (this._questions.length + 1);

        var questionBlockQuestion = document.createElement("div");
        questionBlockQuestion.classList.add("question-block__question");

        var textarea = document.createElement("textarea");
        textarea.cols = "30";
        textarea.rows = "10";
        textarea.placeholder = "Введите вопрос...";

        var attachBlock = document.createElement("div");
        attachBlock.classList.add("question-block__attach-photo-button");

        var fileInput = document.createElement("input");
        fileInput.type = "file";

        var answerTypeBlock = document.createElement("div");
        answerTypeBlock.classList.add("question-block__answer-type");

        var select = document.createElement("select");
        select.name = "answer-type";
        select.addEventListener("change", this._onAnswerTypeChange);

        var testOption = document.createElement("option");
        testOption.value = "test-answer";
        testOption.selected = true;
        testOption.textContent = "Тестовый";

        var handleOption = document.createElement("option");
        handleOption.value = "handle";
        handleOption.selected = false;
        handleOption.textContent = "Ручной";

        var questionBlockAnswer = document.createElement("div");
        questionBlockAnswer.classList.add("question-block__answer");

        var answerBlock = document.createElement("div");
        answerBlock.classList.add("answer-block", "answer-block--test");

        var answerBlockItem = this._createTestAnswer(0);

        var addAnswerButtonBlock = document.createElement("div");
        addAnswerButtonBlock.classList.add("question-block__add-answer");

        var addAnswerButton = document.createElement("button");
        addAnswerButton.textContent = "Добавить вариант ответа";
        addAnswerButton.addEventListener("click", this._onAddAnswerClick);

        select.appendChild(testOption);
        select.appendChild(handleOption);
        attachBlock.appendChild(fileInput);
        answerBlock.appendChild(answerBlockItem);
        questionBlock.appendChild(deleteQuestionButton);
        answerTypeBlock.appendChild(select);
        questionBlockAnswer.appendChild(answerBlock);
        questionBlockAnswer.appendChild(addAnswerButtonBlock);
        addAnswerButtonBlock.appendChild(addAnswerButton);
        questionBlockQuestion.appendChild(textarea);

        questionBlock.appendChild(deleteQuestionButton);
        questionBlock.appendChild(h2);
        questionBlock.appendChild(questionBlockQuestion);
        questionBlock.appendChild(attachBlock);
        questionBlock.appendChild(answerTypeBlock);
        questionBlock.appendChild(questionBlockAnswer);

        return questionBlock;
    };


    /**
     * Обработчик события нажатия на кнопку "Добавить вариант ответа". Метод обновляет массив _questions, добавляет
     * новый контейнер с тестовым ответом в DOM дерево
     * @param {Object} event - объект события
     * @private
     */
    AddTestForm.prototype._onAddAnswerClick = function (event) {
        event.preventDefault();

        var answersBlock = event.target.parentNode.parentNode.querySelector(".answer-block");
        var answerNumber = answersBlock.querySelectorAll(".answer-block__item").length;
        var answer = this._createTestAnswer(answerNumber);

        answersBlock.appendChild(answer);
        this._questions = document.querySelectorAll(".question-block");
    };


    /**
     * Обработчик события нажатия на иконку удаления тестового ответа. Метод обновляет массив _questions, обновляет
     * атрибут data-answer, корректирует placeholder у инпутов, зачищает событие клика на кнопке удаления и удаляет
     * контейнер с ответом из DOM дерева
     * @param {Object} event - объект события
     * @private
     */
    AddTestForm.prototype._onDeleteAnswerClick = function (event) {
        event.preventDefault();
        event.target.removeEventListener("click", AddTestForm.prototype._onDeleteAnswerClick);

        var answerBlockItem = event.target.parentNode;
        var answerBlock = answerBlockItem.parentNode;

        answerBlock.removeChild(answerBlockItem);
        [].forEach.call(answerBlock.querySelectorAll(".answer-block__item"), function (answer, answerNumber) {
            answer.setAttribute("data-answer", String(answerNumber));
            answer.querySelector("button").setAttribute("data-answer", String(answerNumber));
            answer.querySelector("input[type=text]").placeholder = "Ответ " + String(answerNumber + 1);
        });

        this._questions = document.querySelectorAll(".question-block");
    };


    /**
     * Обработчик события нажатия на иконку удаления вопроса. Метод обновляет массив _questions, обновляет
     * атрибут data-question, корректирует заголовок, зачищает события и удаляет из DOM дерева выбранный контейнер с
     * вопросом
     * @param {Object} event - объект события
     * @private
     */
    AddTestForm.prototype._onDeleteQuestionClick = function (event) {
        event.preventDefault();
        event.target.removeEventListener("click", AddTestForm.prototype._onDeleteQuestionClick);

        var questionNumber = event.target.getAttribute("data-question");
        var index = Array.prototype.findIndex.call(this._questions, function (question) {
            return question.getAttribute("data-question") === questionNumber;
        });
        var questionWillDelete = event.target.parentNode;
        var select = questionWillDelete.querySelector("select");

        select.removeEventListener("change", this._onAnswerTypeChange);

        if (select.value === "test-answer") {
            [].forEach.call(questionWillDelete.querySelectorAll(".answer-block__item"), function (answer) {
                answer.querySelector(".answer-block__delete-answer")
                    .removeEventListener("click", AddTestForm.prototype._onDeleteAnswerClick);
            });
        }

        this._questions[index]
            .querySelector(".question-block__add-answer button")
            .removeEventListener("click", this._onAddAnswerClick);
        this._questions = Array.prototype.slice.call(this._questions);
        this._questions.splice(index, 1);
        this._questionsBlock.removeChild(questionWillDelete);

        this._questions.forEach(function (question, questionIndex) {
            question.setAttribute("data-question", String(questionIndex));
            question.querySelector("h2").textContent = "Вопрос " + String(questionIndex + 1);
            question.querySelector(".question-block__delete-question")
                    .setAttribute("data-question", String(questionIndex));
        });
    };


    /**
     * Обработчик события изменения типа ответа на вопрос.
     * @param {Object} event - объект события
     * @private
     */
    AddTestForm.prototype._onAnswerTypeChange = function (event) {
        event.preventDefault();

        var questionNumber = Number(event.target.parentNode.parentNode.getAttribute("data-question"));
        var answerContainer = this._questions[questionNumber].querySelector(".answer-block");

        // Снятие событий с кнопок удаления перед очисткой контейнера
        var deleteAnswerButtons = document.querySelectorAll("button.answer-block__delete-answer");
        deleteAnswerButtons.forEach(function (button) {
            button.removeEventListener("click", AddTestForm.prototype._onDeleteAnswerClick);
        });

        answerContainer.innerHTML = "";

        if (event.target.value === "test-answer") {
            answerContainer.classList.remove("answer-block--handle");
            answerContainer.classList.add("answer-block--test");
            answerContainer.appendChild(this._createTestAnswer(0));
            this._questions[questionNumber]
                .querySelector(".question-block__add-answer")
                .classList
                .remove("question-block__add-answer--hide");
        }
        if (event.target.value === "handle") {
            answerContainer.classList.remove("answer-block--test");
            answerContainer.classList.add("answer-block--handle");
            answerContainer.appendChild(this._createHandleAnswer());
            this._questions[questionNumber]
                .querySelector(".question-block__add-answer")
                .classList
                .add("question-block__add-answer--hide");
        }
    };


    window.AddTestForm = AddTestForm;

})();
