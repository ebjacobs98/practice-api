// This code was influenced from the following tutorials
// https://www.youtube.com/watch?v=CvCiNeLnZ00&ab_channel=DaveGray
// https://www.youtube.com/watch?v=-0exw-9YJBo&ab_channel=TraversyMedia
// https://www.youtube.com/watch?v=mvfsC66xqj0&t=3307s&ab_channel=TraversyMedia

const asyncHandler = require("express-async-handler");
const { User, Class } = require("../models");

const createClass = asyncHandler(async (req, res) => {
  const { _id } = await User.findById(req.user._id);

  const { name } = req.body;
  if (!name || !_id) {
    res.status(400);
    throw new Error(
      "Missing required body fields or could not find valid user"
    );
  }

  const alreadyExists = await Class.findOne({ name, teacher: _id });

  if (alreadyExists) {
    res.status(400);
    throw new Error("Already have a class with same name");
  }

  const createdClass = await Class.create({
    name,
    teacher: _id,
  });

  if (createdClass) {
    res.status(201).json({
      _id: createdClass._id,
      name: createdClass.name,
      teacher: createdClass.teacher,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create class");
  }
});

const deleteClass = asyncHandler(async (req, res) => {
  const { _id } = await User.findById(req.user._id);
  const { classId } = req.body;
  if (!classId || !_id) {
    res.status(400);
    throw new Error(
      "Missing required body fields or could not find valid user"
    );
  }

  const deletedClass = await Class.findOneAndDelete({
    _id: classId,
    teacher: _id,
  });

  if (deletedClass) {
    res.status(200).json({
      _id: deletedClass._id,
      name: deletedClass.name,
      teacher: deletedClass.teacher,
    });
  } else {
    res.status(400);
    throw new Error("Failed to delete class");
  }
});

const getClasses = asyncHandler(async (req, res) => {
  const { _id } = await User.findById(req.user._id);

  const teacherClasses = await Class.find({
    teacher: _id,
  });

  const studentConfirmedClasses = await Class.find({
    students: _id,
  });

  const studentPendingClasses = await Class.find({
    pendingStudents: _id,
  });

  if (teacherClasses || studentConfirmedClasses || studentPendingClasses) {
    res.status(200).json({
      teacherClasses,
      studentConfirmedClasses,
      studentPendingClasses,
    });
  } else {
    res.status(400);
    throw new Error("Failed to get classes");
  }
});

const getClass = asyncHandler(async (req, res) => {
  const { _id } = await User.findById(req.user._id);
  const { classId } = req.body;

  if (!classId || !_id) {
    res.status(400);
    throw new Error(
      "Missing required body fields or could not find valid user"
    );
  }

  const teacherClasses = await Class.find({
    teacher: _id,
    _id: classId,
  });

  if (teacherClasses) {
    res.status(200).json({
      teacherClasses,
    });
  } else {
    res.status(400);
    throw new Error("Failed to get class");
  }
});

const updatePendingStudent = asyncHandler(async (req, res) => {
  const { _id: requestingUserIdObject } = await User.findById(req.user._id);
  const { classId, action, actionId } = req.body;
  const {
    _id: trueClassId,
    pendingStudents,
    teacher,
  } = await Class.findById(classId);

  if (
    !trueClassId ||
    !requestingUserIdObject ||
    !action ||
    !pendingStudents ||
    !actionId ||
    !teacher
  ) {
    res.status(400);
    throw new Error(
      "Missing required body fields or could not find valid user"
    );
  }

  const requestingUserId = requestingUserIdObject.toString();

  const alreadyEnrolled = await Class.findOne({
    $or: [
      { _id: trueClassId, pendingStudents: actionId },
      { _id: trueClassId, students: actionId },
    ],
  });

  if (alreadyEnrolled && action === "add") {
    res.status(400);
    throw new Error("Already enrolled");
  } else if (action === "add" && actionId === requestingUserId) {
    const updatedClass = await Class.findOneAndUpdate(
      {
        _id: trueClassId,
      },
      { pendingStudents: [...pendingStudents, actionId] }
    );

    if (updatedClass) {
      res.status(200).json({
        _id: updatedClass._id,
        name: updatedClass.name,
      });
    } else {
      res.status(400);
      throw new Error("Failed to add student");
    }
  } else if (!alreadyEnrolled && action === "remove") {
    res.status(400);
    throw new Error("Already removed");
  } else if (action === "remove" && requestingUserId === teacher) {
    const newPending = pendingStudents.filter(
      (student) => student !== actionId
    );
    const updatedClass = await Class.findOneAndUpdate(
      {
        _id: trueClassId,
      },
      { pendingStudents: newPending }
    );

    if (updatedClass) {
      res.status(200).json({
        _id: updatedClass._id,
        name: updatedClass.name,
      });
    } else {
      res.status(400);
      throw new Error("Failed to remove student");
    }
  } else {
    res.status(400);
    throw new Error("Failed to update student");
  }
});

const updateConfirmedStudent = asyncHandler(async (req, res) => {
  const { _id: requestingUserIdObject } = await User.findById(req.user._id);
  const { classId, action, actionId } = req.body;
  const {
    _id: trueClassId,
    students,
    pendingStudents,
    teacher,
  } = await Class.findById(classId);
  if (
    !trueClassId ||
    !requestingUserIdObject ||
    !action ||
    !pendingStudents ||
    !students ||
    !actionId ||
    !teacher
  ) {
    res.status(400);
    throw new Error(
      "Missing required body fields or could not find valid user"
    );
  }

  const requestingUserId = requestingUserIdObject.toString();

  const alreadyEnrolled = await Class.findOne({
    _id: trueClassId,
    students: actionId,
  });

  if (alreadyEnrolled && action === "add") {
    res.status(400);
    throw new Error("Already enrolled");
  } else if (action === "add" && requestingUserId === teacher) {
    const newPending = pendingStudents.filter(
      (student) => student !== actionId
    );
    const updatedClass = await Class.findOneAndUpdate(
      {
        _id: trueClassId,
      },
      { pendingStudents: newPending, students: [...students, actionId] }
    );

    if (updatedClass) {
      res.status(200).json({
        _id: updatedClass._id,
        name: updatedClass.name,
      });
    } else {
      res.status(400);
      throw new Error("Failed to add student");
    }
  } else if (!alreadyEnrolled && action === "remove") {
    res.status(400);
    throw new Error("Already removed");
  } else if (action === "remove" && requestingUserId === teacher) {
    const newStudents = students.filter((student) => student !== actionId);
    const updatedClass = await Class.findOneAndUpdate(
      {
        _id: trueClassId,
      },
      { students: newStudents }
    );

    if (updatedClass) {
      res.status(200).json({
        _id: updatedClass._id,
        name: updatedClass.name,
      });
    } else {
      res.status(400);
      throw new Error("Failed to remove student");
    }
  } else {
    res.status(400);
    throw new Error("Failed to update student");
  }
});

const updateAssignedTopics = asyncHandler(async (req, res) => {
  const teacherId = req.user._id.toString();
  const { classId, action, topic } = req.body;
  const {
    _id: trueClassId,
    teacher,
    assignedTopics,
  } = await Class.findById(classId);
  if (
    !trueClassId ||
    !teacherId ||
    !action ||
    !teacher ||
    !assignedTopics ||
    !topic
  ) {
    res.status(400);
    throw new Error(
      "Missing required body fields or could not find valid class"
    );
  }
  if (teacherId !== teacher) {
    res.status(400);
    throw new Error("Do not have access to edit this class");
  }

  const filteredArray = assignedTopics.filter((entry) => entry !== topic);
  if (action === "add") {
    filteredArray.push(topic);
  }
  const updatedClass = await Class.findOneAndUpdate(
    {
      _id: trueClassId,
    },
    { assignedTopics: filteredArray }
  );
  if (updatedClass) {
    res.status(200).json({
      _id: updatedClass._id,
      name: updatedClass.name,
    });
  } else {
    res.status(400);
    throw new Error("Failed to update topics");
  }
});

module.exports = {
  updatePendingStudent,
  updateConfirmedStudent,
  updateAssignedTopics,
  createClass,
  deleteClass,
  getClasses,
  getClass,
};
