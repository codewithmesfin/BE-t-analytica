module.exports = function(Report) {
  Report.getTracerReport = async (collegeId, year) => {
    const { Trainee } = Report.app.models;
    const oneYearBack = year - 1;

    // filter valid trainees
    const trainees = await Trainee.find({
      where: {
        collegeId,
        certifiedYear: oneYearBack
      },
      include: ["occupation"]
    });

    // group by occupation
    const grouped = trainees.reduce((res, trainee) => {
      if (res[trainee.occupationId]) {
        res[trainee.occupationId].push(trainee);
      } else {
        res[trainee.occupationId] = [trainee];
      }
      return res;
    }, {});

    // stat
    const result = grouped.map(occupation => {
      // if monthly report : employedMonth =  month;
      const occupationTrainees = grouped[occupation];
      const certified = occupationTrainees.length;
      const totalEmployed = occupationTrainees.filter(
        trainee => trainee.isEmployed
      ).length;
      const percentEmployed = (totalEmployed / certified) * 100;

      const wage = occupationTrainees.filter(
        trainee => trainee.employmentType === "WAGE"
      ).length;

      const self = occupationTrainees.filter(
        trainee => trainee.employmentType === "SELF"
      ).length;

      return {
        certified,
        totalEmployed,
        self,
        wage,
        percentEmployed
      };
    });

    return result;
  };

  Report.remoteMethod("getTracerReport", {
    description: "Save job details",
    accepts: [
      { arg: "collegeId", type: "string", required: true },
      { arg: "year", type: "number", required: true },
      { arg: "month", type: "number", required: true }
    ],
    returns: {
      type: "object",
      root: true
    },
    http: {
      verb: "get",
      path: "/tracer-report"
    }
  });
};
