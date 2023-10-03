const formatResponse = (results) => {
  return results.map((row) => ({
    subSpecialty: {
      id: row.subSpecialtyId,
      SubSpecialtyName: row.subSpecialtyName,
      description: row.subSpecialtyDescription,
      status: row.subSpecialtyStatus,
      createdAt: row.subSpecialtyCreatedAt,
      updatedAt: row.subSpecialtyUpdatedAt,
    },
    specialty: {
      id: row.specialtyId,
      specialtyName: row.specialtyName,
      description: row.specialtyDescription,
      status: row.specialtyStatus,
      createdAt: row.specialtyCreatedAt,
      updatedAt: row.specialtyUpdatedAt,
    },
    hospital: {
      id: row.hospitalId,
      name: row.hospitalName,
      address: row.hospitalAddress,
      email: row.hospitalEmail,
      contactNo: row.hospitalContactNo,
      city: row.hospitalCity,
      fileKey: row.hospitalFileKey,
      status: row.hospitalStatus,
    },
  }));
};

const formatSpecialty = (results) => {
  return results.map((row) => ({
    subSpecialty: {
      id: row.subSpecialtyId,
      SubSpecialtyName: row.subSpecialtyName,
      description: row.subSpecialtyDescription,
      status: row.subSpecialtyStatus,
      createdAt: row.subSpecialtyCreatedAt,
      updatedAt: row.subSpecialtyUpdatedAt,
    },
    specialty: {
      id: row.specialtyId,
      specialtyName: row.specialtyName,
      description: row.specialtyDescription,
      status: row.specialtyStatus,
      createdAt: row.specialtyCreatedAt,
      updatedAt: row.specialtyUpdatedAt,
    },
  }));
};

const specialityList = (results) => {
  return results.map((item) => ({
    id: item?.specialty?.id,
    specialtyName: item?.specialty?.specialtyName,
  }));
};

const subSpecialtyList = (results) => {
  return results.map((item) => ({
    id: item?.subspecialty?.id,
    subSpecialtyName: item?.subspecialty?.SubSpecialtyName,
  }));
};

const timeSlot = (results) => {
  return results.map((item) => ({
    id: item?.timeslot?.id,
    timeSlot: item?.timeslot?.timeSlot,
  }));
};

const doctorTimeSlotList = (results) => {
  const groupedSlots = new Map();

  results.forEach((slot) => {
    const doctorId = slot.doctor.id;
    if (!groupedSlots.has(doctorId)) {
      groupedSlots.set(doctorId, {
        doctorId: doctorId,
        doctorName: slot.doctor.name,
        hospitalId: slot.doctor.hospital.id,
        hospitalName: slot.doctor.hospital.name,
        TimeSlots: [],
      });
    }
    groupedSlots.get(doctorId).TimeSlots.push({
      id: slot.timeslot.id,
      timeSlot: slot.timeslot.timeSlot,
    });
  });

  // Convert the map values to an array
  return Array.from(groupedSlots.values());


}
module.exports = {
  formatResponse,
  formatSpecialty,
  specialityList,
  subSpecialtyList,
  timeSlot,
  doctorTimeSlotList
};
