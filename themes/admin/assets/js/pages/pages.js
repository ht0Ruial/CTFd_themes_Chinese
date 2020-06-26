import "./main";
import CTFd from "core/CTFd";
import $ from "jquery";
import { ezQuery } from "core/ezq";

function deleteSelectedUsers(event) {
  let pageIDs = $("input[data-page-id]:checked").map(function() {
    return $(this).data("page-id");
  });
  let target = pageIDs.length === 1 ? "page" : "pages";

  ezQuery({
    title: "删除页面",
    body: `Are you sure you want to delete ${pageIDs.length} ${target}?`,
    success: function() {
      const reqs = [];
      for (var pageID of pageIDs) {
        reqs.push(
          CTFd.fetch(`/api/v1/pages/${pageID}`, {
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

$(() => {
  $("#pages-delete-button").click(deleteSelectedUsers);
});