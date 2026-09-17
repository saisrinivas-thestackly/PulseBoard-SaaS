import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  status: { type: String, enum: ['todo', 'in_progress', 'completed', 'overdue'], default: 'todo', index: true },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
}, { versionKey: false })

projectSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = new Date()
  }
  next()
})

export default mongoose.model('Project', projectSchema)
