import "./main";
import CTFd from "core/CTFd";
import $ from "jquery";
import { ezAlert, ezQuery } from "core/ezq";

const api_func = {
  users: (x, y) => CTFd.api.patch_user_public({ userId: x }, y),
  teams: (x, y) => CTFd.api.patch_team_public({ teamId: x }, y)
};

function toggleAccount() {
  const $btn = $(this);
  const id = $btn.data("account-id");
  const state = $btn.data("state");
  let hidden = undefined;
  if (state === "visible") {
    hidden = true;
  } else if (state === "hidden") {
    hidden = false;
  }

  const params = {
    hidden: hidden
  };

  api_func[CTFd.config.userMode](id, params).then(response => {
    if (response.success) {
      if (hidden) {
        $btn.data("state", "hidden");
        $btn.addClass("btn-danger").removeClass("btn-success");
        $btn.text("Hidden");
      } else {
        $btn.data("state", "visible");
        $btn.addClass("btn-success").removeClass("btn-danger");
        $btn.text("Visible");
      }
    }
  });
}

function toggleSelectedAccounts(accountIDs, action) {
  const params = {
    hidden: action === "hidden" ? true : false
  };
  const reqs = [];
  for (var accId of accountIDs) {
    reqs.push(api_func[CTFd.config.userMode](accId, params));
  }
  Promise.all(reqs).then(responses => {
    window.location.reload();
  });
}

function bulkToggleAccounts(event) {
  let accountIDs = $("input[data-account-id]:checked").map(function() {
    return $(this).data("account-id");
  });

  ezAlert({
    title: "切换可见",
    body: $(`
    <form id="scoreboard-bulk-edit">
      <div class="form-group">
        <label>可见</label>
        <select name="visibility" data-initial="">
          <option value="">--</option>
          <option value="visible">可见</option>
          <option value="hidden">隐藏</option>
        </select>
      </div>
    </form>
    `),
    button: "提交",
    success: function() {
      let data = $("#scoreboard-bulk-edit").serializeJSON(true);
      let state = data.visibility;
      toggleSelectedAccounts(accountIDs, state);
    }
  });
}

$(() => {
  $(".scoreboard-toggle").click(toggleAccount);
  $("#scoreboard-edit-button").click(bulkToggleAccounts);
});
