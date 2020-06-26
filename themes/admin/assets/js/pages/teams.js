import "./main";
import CTFd from "core/CTFd";
import $ from "jquery";
import { ezAlert, ezQuery } from "core/ezq";

function deleteSelectedTeams(event) {
  let teamIDs = $("input[data-team-id]:checked").map(function() {
    return $(this).data("team-id");
  });
  let target = teamIDs.length === 1 ? "team" : "teams";

  ezQuery({
    title: "删除团队",
    body: `Are you sure you want to delete ${teamIDs.length} ${target}?`,
    success: function() {
      const reqs = [];
      for (var teamID of teamIDs) {
        reqs.push(
          CTFd.fetch(`/api/v1/teams/${teamID}`, {
            method: "DELETE"
          })
        );
      }
      Promise.all(reqs).then(responses => {
        window.location.reload();
      });
    }
  });
}

function bulkEditTeams(event) {
  let teamIDs = $("input[data-team-id]:checked").map(function() {
    return $(this).data("team-id");
  });

  ezAlert({
    title: "编辑团队",
    body: $(`
    <form id="teams-bulk-edit">
      <div class="form-group">
        <label>禁止</label>
        <select name="banned" data-initial="">
          <option value="">--</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
      <div class="form-group">
        <label>隐藏</label>
        <select name="hidden" data-initial="">
          <option value="">--</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
    </form>
    `),
    button: "提交",
    success: function() {
      let data = $("#teams-bulk-edit").serializeJSON(true);
      const reqs = [];
      for (var teamID of teamIDs) {
        reqs.push(
          CTFd.fetch(`/api/v1/teams/${teamID}`, {
            method: "PATCH",
            body: JSON.stringify(data)
          })
        );
      }
      Promise.all(reqs).then(responses => {
        window.location.reload();
      });
    }
  });
}

$(() => {
  $("#teams-delete-button").click(deleteSelectedTeams);
  $("#teams-edit-button").click(bulkEditTeams);
});