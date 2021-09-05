{
  let createpost = () => {
    let newPostform = $("#new-post");

    newPostform.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "POST",
        url: "/users/postcreate",
        data: newPostform.serialize(),
        success: function (data) {
          console.log(data);
          let newpost = createpostdom(data.data.post);

          $("#post-container").prepend(newpost);
          let postshow = $(" .delete-post", newpost);

          deletePost(postshow);

          new PostComments(data.data.post._id);
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  let createpostdom = (post) => {
    return $(`<div id="post-${post._id}">
        
          ${post.content}
          <small>${post.user.name}</small>
           
              <small><a class="delete-post" href="/users/delete/${post._id}">Delete</a></small>       
            
          
          <form action="/users/commentcreate" id="new-comment" method="POST">
              <textarea name="content" cols="10" rows="1" required></textarea>
              <input type="hidden" name="post" value="${post._id}" />
              <input type="submit" value="comment" />
          </form>
          
          
          <section id="comment-container">
          </section>
          
          
      </div>
      
         `);
  };

  let deletePost = (deletelink) => {
    $(deletelink).click(function (e) {
      e.preventDefault();
      $.ajax({
        type: "GET",

        url: $(deletelink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
          console.log(data);
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  let convertPostsToAjax = () => {
    $("#post-container")
      .children()
      .children()
      .children("a.delete-post")
      .each(function () {
        let self = $(this);
        let deletebutton = (" .delete-post", self);
        deletePost(deletebutton);

        let postId = self.prop("id").split("-")[1];
        new PostComments(postId);
      });
  };

  createpost();
  convertPostsToAjax();
}
