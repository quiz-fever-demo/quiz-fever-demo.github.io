import * as api from './api.js';

const host = 'https://parseapi.back4app.com';
api.settings.host = host;

export const login = api.login;
export const logout = api.logout;
export const register = api.register;


function createPointer(name, id) {
    return {
        __type: 'Pointer',
        className: name,
        objectId: id,
    };
}

function addOwner(object) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const result = Object.assign({}, object);
    result.owner = createPointer('_User', user.id);
    return result;
}

// QUIZ COLLECTION

export async function getAllQuizes() {
    return await api.get(host + '/classes/Quiz' + '?include=owner');
}

export async function getQuizById(id) {
    return await api.get(host + '/classes/Quiz/' + id + '?include=owner');
}

export async function createQuiz(data) {
    const body = addOwner(data);
    return await api.post(host + '/classes/Quiz', body);
}

export async function updateQuizById(id, data) {
    return await api.put(host + '/classes/Quiz/' + id, data);
}

export async function deleteQuizById(id) {
    return await api.del(host + '/classes/Quiz/' + id);
}

// QUESTION COLLECTION

export async function createQuestion(quizId, question) {
    const body = addOwner(question);
    body.quiz = createPointer('Quiz', quizId);
    return await api.post(host + '/classes/Question', body);
}

export async function getQuestionsByQuizId(quizId) {
    const query = JSON.stringify({ quiz: createPointer('Quiz', quizId) });
    const response = await api.get(host + '/classes/Question?where=' + encodeURIComponent(query));
    return response.results;
}

export async function updateQuestionById(questionId, data) {
    return await api.put(host + '/classes/Question/' + questionId, data);
}

export async function deleteQuestionById(questionId) {
    return await api.del(host + '/classes/Question/' + questionId);
}