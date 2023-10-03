

const subSpecialtyQuery = `
  SELECT
    ss.id AS subSpecialtyId,
    ss.SubSpecialtyName,
    ss.description AS subSpecialtyDescription,
    ss.status AS subSpecialtyStatus,
    ss.createdAt AS subSpecialtyCreatedAt,
    ss.updatedAt AS subSpecialtyUpdatedAt,
    sp.id AS specialtyId,
    sp.specialtyName AS specialtyName,
    sp.description AS specialtyDescription,
    sp.status AS specialtyStatus,
    sp.createdAt AS specialtyCreatedAt,
    sp.updatedAt AS specialtyUpdatedAt,
    h.id AS hospitalId,
    h.name AS hospitalName,
    h.address AS hospitalAddress,
    h.email AS hospitalEmail,
    h.contactNo AS hospitalContactNo,
    h.city AS hospitalCity,
    h.fileKey AS hospitalFileKey,
    h.status AS hospitalStatus
  FROM
    subSpecialties ss
    INNER JOIN specialties sp ON ss.specialtyId = sp.id
    INNER JOIN specialtyHospitals sh ON sp.id = sh.specialtyId
    INNER JOIN hospitals h ON sh.hospitalId = h.id
  WHERE
    ss.status = 1
    AND sp.status = 1
    AND h.status = 1
`;

module.exports = subSpecialtyQuery;
