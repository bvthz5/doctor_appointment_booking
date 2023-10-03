const { getHospital } = require("../Service/adminService");
const { getHospitalId } = require("../Service/packageService");
const timeslotService = require("../Service/timeSlotService");
const getAllTimeSlots = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { items, count } = await timeslotService.timeSlotList(page, limit);
    const totalPages = Math.ceil(count / limit);
    const hasNext = page < totalPages;
    const response = {
      items,
      count,
      hasNext,
      currentPage: page,
      totalPages,
    };
    res.send(response);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const addTimeSlot = async (req, res, next) => {
  try {
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;

    const add30Minutes = (time) => {
      const [hours, minutes] = time.split(":");
      const currentTime = new Date();
      currentTime.setHours(parseInt(hours));
      currentTime.setMinutes(parseInt(minutes) + 30);
      return `${String(currentTime.getHours()).padStart(2, "0")}:${String(
        currentTime.getMinutes()
      ).padStart(2, "0")}`;
    };

    let timesArray = [];

    let currentTime = startTime;
    while (currentTime !== endTime) {
      timesArray.push(currentTime);
      currentTime = add30Minutes(currentTime);
    }
    const slotList = await timeslotService.getTimeSlot(timesArray);
    if (slotList.length == 0) {
      return res.status(400).send({
        message: "All times has been already added!Please select another range",
      });
    }

    const data = slotList.map((timeSlot) => ({
      timeSlot,
      status: 1,
    }));

    await timeslotService.addTimes(data);
    res.send({ message: "Timeslots added successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const hospitalTimeSlots = async (req, res, next) => {
  try {
    let hospitalId;
    if (req.user.role === "SUPERADMIN") {
      if (!req.query.hospitalId) {
        return res
          .status(400)
          .send({ errorCode: 1158, message: "Hospital Id is required" });
      } else {
        hospitalId = req.query.hospitalId;
        await getHospitalId(hospitalId);
      }
    } else {
      hospitalId = await getHospital(req.user.id);
    }
    const slots = await timeslotService.hospitalSlots(hospitalId);
    res.send(slots);
  } catch (err) {
    next(err);
  }
};

const addHospitalTimeSlots = async (req, res, next) => {
  try {
    let hospitalId;
    const times = req.body.timeSlots;
    if (req.user.role === "SUPERADMIN") {
      if (!req.body.hospitalId) {
        return res
          .status(400)
          .send({ errorCode: 1158, message: "Hospital Id is required" });
      } else {
        hospitalId = req.body.hospitalId;
        await getHospitalId(hospitalId);
      }
    } else {
      hospitalId = await getHospital(req.user.id);
    }
    await timeslotService.validateIds(times);
    await timeslotService.addHsplTimeSlot(hospitalId, times);
    res.send({ message: "Timeslots updated successfully" });
  } catch (error) {
    next(error);
  }
};

const doctorTimeslots = async (req, res, next) => {
  try {
    let hospitalId;
    if (req.user.role === "SUPERADMIN") {
      if (!req.query.hospitalId) {
        return res
          .status(400)
          .send({ errorCode: 1158, message: "Hospital Id is required" });
      } else {
        hospitalId = req.query.hospitalId;
        await getHospitalId(hospitalId);
      }
    } else {
      hospitalId = await getHospital(req.user.id);
    }
    const doctorSlots = await timeslotService.getdoctorSlots(hospitalId)
    res.send(doctorSlots)
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTimeSlots,
  addTimeSlot,
  hospitalTimeSlots,
  addHospitalTimeSlots,
  doctorTimeslots,
};
