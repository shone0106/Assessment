import mongoose from 'mongoose'

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
})

type Article = mongoose.InferSchemaType<typeof articleSchema>


export default mongoose.model<Article>('Article', articleSchema)