import "./main";
import $ from "jquery";
import { ezQuery } from "core/ezq";

function reset(event) {
  event.preventDefault();
  ezQuery({
    title: "重置 CTF?",
    body: "您确定要重置CTFd实例吗?",
    success: function() {
      $("#reset-ctf-form")
        .off("submit")
        .submit();
    }
  });
}

$(() => {
  $("#reset-ctf-form").submit(reset);
});
