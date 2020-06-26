import $ from "jquery";
import CTFd from "core/CTFd";
import { default as helpers } from "core/helpers";
import { ezQuery } from "core/ezq";

export function addFile(event) {
  event.preventDefault();
  let form = event.target;
  let data = {
    challenge: CHALLENGE_ID,
    type: "challenge"
  };
  helpers.files.upload(form, data, function(response) {
    setTimeout(function() {
      window.location.reload();
    }, 700);
  });
}

export function deleteFile(event) {
  const file_id = $(this).attr("file-id");
  const row = $(this)
    .parent()
    .parent();
  ezQuery({
    title: "删除文件",
    body: "你确定要删除这些文件吗？",
    success: function() {
      CTFd.fetch("/api/v1/files/" + file_id, {
        method: "DELETE"
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(response) {
          if (response.success) {
            row.remove();
          }
        });
    }
  });
}
