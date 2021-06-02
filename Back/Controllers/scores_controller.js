const {
  scoresRepository,
  answersRepository,
} = require('../Repositories/index');
const { questionsRepository } = require('../Repositories/index');

async function voteQuestion(req, res, next) {
  try {
    const { id, rol } = req.auth;
    const { id_question } = req.params;
    if (!id && rol !== 'admin') {
      const error = new Error('Solo usuarios logueados pueden votar');
      error.code = 401;
      throw error;
    }
    const votesAmount = await scoresRepository.countQuestionVotesByUserId(
      id,
      id_question
    );
    if (votesAmount.votos !== 0) {
      const error = new Error('Ya has votado en esta pregunta');
      error.code = 401;
      throw error;
    }
    const questionUser = await questionsRepository.findUserByQuestionId(
      id_question
    );

    await scoresRepository.addQuestionVote(id_question, id, questionUser);
    const questionVotes = await scoresRepository.countVotesByQuestionId(
      id_question
    );

    res.status(201);
    res.send(questionVotes);
  } catch (err) {
    next(err);
  }
}

async function voteAnswer(req, res, next) {
  try {
    const { id, rol } = req.auth;
    const { id_answer } = req.params;
    if (!id && rol !== 'admin') {
      const error = new Error('Solo usuarios logueados pueden votar');
      error.code = 401;
      throw error;
    }

    const votesAmount = await scoresRepository.countAnswerVotesByUserId(
      id,
      id_answer
    );
    if (votesAmount.votos !== 0) {
      const error = new Error('Ya has votado en esta respuesta');
      error.code = 401;
      throw error;
    }
    const answerUser = await answersRepository.findUserByAnswerId(id_answer);

    await scoresRepository.addAnswerVote(id_answer, id, answerUser);
    const answerVotes = await scoresRepository.countVotesByAnswerId(id_answer);
    res.status(201);
    res.send(answerVotes);
  } catch (err) {
    next(err);
  }
}

async function voteComment(req, res, next) {
  try {
    const { id } = req.auth;
    const { id_answer } = req.params;

    const votesAmount = await scoresRepository.countCommentVotesByUserId(
      id,
      id_answer
    );
    if (votesAmount.votos !== 0) {
      const error = new Error('Ya has votado en este comentario');
      error.httpCode = 409;
      throw error;
    }
    const commentUser = await answersRepository.findUserByAnswerId(id_answer);

    await scoresRepository.addCommentVote(id_answer, id, commentUser);
    const commentVotes = await scoresRepository.countVotesByCommentId(
      id_answer
    );

    res.status(201);
    res.send(commentVotes);
  } catch (err) {
    next(err);
  }
}
module.exports = {
  voteQuestion,
  voteAnswer,
  voteComment,
};
