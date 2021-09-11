const queue = require('../config/kue')

const commentsMailer = require('../mailers/comments-mailer')

queue.process('emails-queue'/* name of queue */,(job, done) => {
  console.log('emails  worker is processing a job', job.data)
  commentsMailer.newComment(job.data)
  done()
})
