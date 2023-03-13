const { Schema } = require("mongoose");

const defaultMetrics = {
  questionsAnswered: 0,
  fastestTime: 0,
  metrics: [],
};

const defaultTopicsMetrics = {
  expressions: defaultMetrics,
  linearEquations: defaultMetrics,
  linearInequalities: defaultMetrics,
  idGraphs: defaultMetrics,
  linearGraphs: defaultMetrics,
  systems: defaultMetrics,
  exponential: defaultMetrics,
  factorPolynomial: defaultMetrics,
  quadratic: defaultMetrics,
  probability: defaultMetrics,
  squareRoots: defaultMetrics,
  expressionReview: defaultMetrics,
};

const topicSchema = new Schema(
  {
    questionsAnswered: { type: Number, default: 0, required: true },
    fastestTime: { type: Number, default: 0, required: true },
    metrics: { type: [Number], default: [], required: true },
  },
  { _id: false }
);

const topicsSchema = new Schema(
  {
    expressions: { type: topicSchema },
    linearEquations: { type: topicSchema },
    linearInequalities: { type: topicSchema },
    idGraphs: { type: topicSchema },
    linearGraphs: { type: topicSchema },
    systems: { type: topicSchema },
    exponential: { type: topicSchema },
    factorPolynomial: { type: topicSchema },
    quadratic: { type: topicSchema },
    probability: { type: topicSchema },
    squareRoots: { type: topicSchema },
    expressionReview: { type: topicSchema },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: [true, "Must have name"] },
    email: { type: String, required: [true, "Must have email"], unique: true },
    password: { type: String, required: [true, "Must have password"] },
    topics: {
      type: topicsSchema,
      required: true,
      default: defaultTopicsMetrics,
    },
  },
  { timestamps: true }
);

module.exports = UserSchema;
