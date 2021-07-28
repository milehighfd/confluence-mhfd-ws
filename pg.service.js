const db = require('./config/db');

const Board = db.board;
const BoardProject = db.boardProject;

const saveReqmanager = async (board_id, reqmanager) => {
  let board = await Board.findOne({
    where: {
        _id: board_id
    }
  });
  board.targetcost1 = reqmanager[0];
  board.targetcost2 = reqmanager[1];
  board.targetcost3 = reqmanager[2];
  board.targetcost4 = reqmanager[3];
  board.targetcost5 = reqmanager[4];
  board.save({fields: ['targetcost1', 'targetcost2', 'targetcost3', 'targetcost4', 'targetcost5']});
}

const saveColumns = (board_id, columns) => {
  let map = {};
  columns.forEach((column, columnIdx) => {
    column.projects.forEach((project, rowId) => {
      let pid = project.project_id;
      if (!map[pid]) {
        map[pid] = {
          project_id: project.project_id,
          req1: project.req1,
          req2: project.req2,
          req3: project.req3,
          req4: project.req4,
          req5: project.req5
        }
      }
      map[pid][`position${columnIdx}`] = rowId;
    })
  })
  Object.keys(map).forEach(pid => {
    updateProject(board_id, map[pid]);
  })
}

const isUndefOrNull = (val) => {
  if (val === undefined || val === null) {
    return null;
  } else {
    return val;
  }
}

const updateProject = async (board_id, project) => {
  let boardProjects = await BoardProject.findOne({
    where: {
        board_id: board_id,
        project_id: `${project.project_id}`
    }
  });
  boardProjects.position0 = isUndefOrNull(project.position0);
  boardProjects.position1 = isUndefOrNull(project.position1);
  boardProjects.position2 = isUndefOrNull(project.position2);
  boardProjects.position3 = isUndefOrNull(project.position3);
  boardProjects.position4 = isUndefOrNull(project.position4);
  boardProjects.position5 = isUndefOrNull(project.position5);
  boardProjects.req1 = isUndefOrNull(project.req1);
  boardProjects.req2 = isUndefOrNull(project.req2);
  boardProjects.req3 = isUndefOrNull(project.req3);
  boardProjects.req4 = isUndefOrNull(project.req4);
  boardProjects.req5 = isUndefOrNull(project.req5);
  boardProjects.save({fields: ['position0', 'position1', 'position2', 'position3', 'position4', 'position5', 'req1', 'req2', 'req3', 'req4', 'req5']});
}

module.exports = {
  saveColumns,
  saveReqmanager
};
