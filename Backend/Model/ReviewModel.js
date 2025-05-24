import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });
reviewSchema.statics.calculateAverageRating = async function (bookId) {
  const result = await this.aggregate([
    { $match: { bookId } },
    {
      $group: {
        _id: "$bookId",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  const avgRating = result[0]?.averageRating || 0;
  await mongoose.model("Book").findByIdAndUpdate(bookId, {
    ratingsAvg: avgRating.toFixed(1),
  });
};

reviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.bookId);
});

reviewSchema.post("findByIdAndDelete", async function (doc) {
  if (doc) {
    await this.doc.constructor.calculateAverageRating(doc.bookId);
  }
});
export default mongoose.model("Review", reviewSchema);
