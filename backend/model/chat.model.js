import mongoose from 'mongoose'

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  threadId: {
    type: String,
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true })

chatMessageSchema.index({ userId: 1, threadId: 1 })
chatMessageSchema.index({ userId: 1, createdAt: -1 })

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema)
export default ChatMessage

