const Test = require("../models/test");


module.exports = (req, res) => {
    Test.getTestById(req.params.testId, (err, test) => {
        if (err) {
            throw err;
        }
        if (!req.isAuthenticated()) {
            return res.redirect("/");
        }
        if (!test) {
            return res.status(400).json({ status: "error", reason: "Тест не найден" });
        }

        let testId = req.cookies.testId ? req.cookies.testId : String(test._id);
        let questionIndexes = req.cookies.questionIndexes
            ? JSON.parse(req.cookies.questionIndexes)
            : getIndexesFromShuffleArray(test.data, test.questionsCount);
        let currentIndex = req.cookies.currentIndex ? Number(req.cookies.currentIndex) : 0;
        let correctAnswer = req.cookies.correctAnswer ? Number(req.cookies.correctAnswer) : 0;

        if (req.cookies.testId) {
            if (test.data[questionIndexes[currentIndex]].type === "handle") {
                if (req.params.answer.toLowerCase() === test.data[questionIndexes[currentIndex]].answer.toLowerCase()) {
                    correctAnswer++;
                }
            }
            if (test.data[questionIndexes[currentIndex]].type === "test-answer") {
                let isCorrectAnswer = true;

                for (let i = 0; i < test.data[questionIndexes[currentIndex]].answers.length; i++) {
                    let isRight = test.data[questionIndexes[currentIndex]].answers[i].isRight;

                    if (isRight && !req.query["answer" + String(i)] || !isRight && req.query["answer" + String(i)]) {
                        isCorrectAnswer = false;
                    }
                }

                if (isCorrectAnswer) {
                    correctAnswer++;
                }
            }

            currentIndex++;

            if (questionIndexes.length === currentIndex) {
                res.clearCookie("testId");
                res.clearCookie("questionIndexes");
                res.clearCookie("currentIndex");
                res.clearCookie("correctAnswer");

                let progress = Math.round((correctAnswer * 100) / test.questionsCount);

                return res.render("test-result", {
                    title: progress >= 60 ? "Успех" : "Неудача",
                    userPage: true,
                    success: progress >= 60,
                    progress: progress,
                    correctAnswers: correctAnswer,
                    questionsCount: test.questionsCount,
                    testId: String(test._id)
                });
            }
        }

        // Обновление cookies
        res.cookie("testId", testId);
        res.cookie("questionIndexes", JSON.stringify(questionIndexes));
        res.cookie("currentIndex", currentIndex);
        res.cookie("correctAnswer", correctAnswer);

        res.render("test", {
            title: test.name,
            userPage: true,
            testId: testId,
            question: test.data[questionIndexes[currentIndex]].question,
            file: test.file,
            handleType: test.data[questionIndexes[currentIndex]].type === "handle",
            testType: test.data[questionIndexes[currentIndex]].type === "test-answer",
            answers: test.data[questionIndexes[currentIndex]].answers
        });
    });
};


const getIndexesFromShuffleArray = (array, questionCount) => {
    if (typeof array !== "object" || array.length < questionCount) {
        return null;
    }

    let data = array.map((item, index) => index);

    for (let k = 0; k < array.length; k++) {
        let i = Math.floor(Math.random() * data.length);
        let j = Math.floor(Math.random() * data.length);

        let temp = data[i];
        data[i] = data[j];
        data[j] = temp;
    }

    data.splice(questionCount, array.length - questionCount);

    return data;
};
