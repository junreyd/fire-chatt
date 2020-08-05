var firebaseConfig = {
  apiKey: "AIzaSyDqtR2_hDyvrmXqynZWoi8rg3GDR539XpI",
  authDomain: "ir-chatbox.firebaseapp.com",
  databaseURL: "https://ir-chatbox.firebaseio.com",
  projectId: "ir-chatbox",
  storageBucket: "ir-chatbox.appspot.com",
  messagingSenderId: "212157712124",
  appId: "1:212157712124:web:5c3a7caeea18d58b4db979",
  measurementId: "G-E770YJFP4D"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();


$(function () {
  var ref = firebase.database().ref("message");

  ref.on("child_added", function (snapshot) {

    let html = "";
    let delet = "";
    var start = moment(new Date());

    // if (snapshot.val().sender == currentUserCompleteName) {
    //   delet += `<a onclick="deleteMessage('${snapshot.key}'); return false;" class='delete'>Delete</a>`;
    // }

    html += `<div class='comment' id=${snapshot.val().id}>`;
    html += `<div class='content'>
              <a class='author'>${snapshot.val().sender}</a>
              <div class='metadata'>
                <span class='date'>${start.from(new Date(snapshot.val().createdAt))}</span>
              </div>
              <div class='text'>${snapshot.val().message}
              </div>
              <div class='actions'>
              <a onclick="deleteMessage('${snapshot.key}'); return false;" class='delete'>Delete</a>
              <a onclick="reply('${snapshot.val().sender}', '${snapshot.val().id}'); return false;" class='reply'>Reply</a>
              </div>
            </div>`;
    html += "</div>"
    document.getElementById("bodyChat").innerHTML += html;

    // setTimeout(function () {
    //   // make auto scroll to the bottom
    //   var element = document.getElementById("bodyChat");
    //   element.scrollTop = element.scrollHeight;

    //   $("#add_loading").hide();
    // }, 1000);

    var element = document.getElementById("bodyChat");
    element.scrollTop = element.scrollHeight;
  });
});




function irlistvalidation(hasChatdata) {
  var id = getQueryString()["ID"];
  $.ajax({
    url: `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbyTitle('IR Chatbox')/items?$filter=IR_x0020_id eq ${id}`,
    type: "GET",
    headers: {
      "Accept": "application/json;odata=verbose",
      "content-type": "application/json;odata=verbose",
    },
    success: function (data) {
      if (data.d.results.length) {
        onQuerySucceeded1(data.d.results, hasChatdata);

        for (let i = 0; i < data.d.results.length; i++) {
          if (data.d.results[i].Admin == targetUser) {
            $("#getparticipant_id").hide();
            $("#closechat_id").show();
          } else {
            $("#getparticipant_id").hide();
          }
        }
      } else {
        $("#descript_id").show();
        $(".ui.comments").hide();
        $("#getparticipant_id").show();
        $("#closechat_id").hide();
        $("#add_loading").hide();
      }
    },
    error: function (xhr, status, error) {
      console.log(xhr, status, error);
    }
  });
}


function irlistvalidation2() {
  var id = getQueryString()["ID"];
  $.ajax({
    url: `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbyTitle('IR Chatbox')/items?$filter=IR_x0020_id eq ${id}`,
    type: "GET",
    headers: {
      "Accept": "application/json;odata=verbose",
      "content-type": "application/json;odata=verbose",
    },
    success: function (data) {
      if (data.d.results.length) {
        onQuerySucceeded1(data.d.results, hasChatdata = 'no');

        for (let i = 0; i < data.d.results.length; i++) {
          if (data.d.results[i].Admin == targetUser) {
            $("#getparticipant_id").hide();
            $("#closechat_id").show();
          } else {
            $("#getparticipant_id").hide();
          }
        }
      } else {
        $("#descript_id").show();
        $(".ui.comments").hide();
        $("#getparticipant_id").show();
        $("#closechat_id").hide();
        $("#add_loading").hide();
      }
    },
    error: function (xhr, status, error) {
      console.log(xhr, status, error);
    }
  });
}


function removechatmessage() {
  var id = getQueryString()["ID"];
  var ref = firebase.database().ref("message");

  ref.once('value').then(function (snapshot) {
    snapshot.forEach(function (data) {
      if (data.val().irID == id) {

        $("#messreply").val('');
        let html = "";
        let delet = "";

        if (data.val().sender == currentUserCompleteName) {
          delet += `<a onclick="deleteMessage('${data.key}'); return false;" class='delete'>Delete</a>`;
        }

        var start = moment(new Date());

        html += `<div class='comment' id=${data.val().id}>`;
        html += `<div class='content'>
              <a class='author'>${data.val().sender}</a>
              <div class='metadata'>
                <span class='date'>${start.from(new Date(data.val().createdAt))}</span>
              </div>
              <div class='text'>${data.val().message}
              </div>
              <div class='actions'>
              ${delet}
              <a onclick="reply('${data.val().sender}', '${data.val().id}'); return false;" class='reply'>Reply</a>
              </div>
            </div>`;
        html += "</div>"
        document.getElementById("bodyChat").innerHTML += html;

        // make auto scroll to the bottom
        // var element = document.getElementById("bodyChat");
        // element.scrollTop = element.scrollHeight;

        // document.getElementById("messreply").focus();
      }
    });
  });
}


function getparticipants() {
  $("#add_loading").show();

  $('.ui.small.modal').modal({
    onApprove: function () {
      return false; //Return false as to not close modal dialog
    }
  }).modal('show');

  var itemArray = [];
  var id = getQueryString()["ID"];
  const peoplePicker = $('#peoplePickerDiv_TopSpan_HiddenInput').val() != "" && JSON.parse($('#peoplePickerDiv_TopSpan_HiddenInput').val());
  let newpeoplePicker = [...new Map(peoplePicker.map(obj => [JSON.stringify(obj), obj])).values()];

  var clientContext = SP.ClientContext.get_current();
  var oList = clientContext.get_web().get_lists().getByTitle('IR Chatbox');

  for (let i = 0; i < newpeoplePicker.length; i++) {
    const participantsusername = newpeoplePicker[i].Key.substring(newpeoplePicker[i].Key.indexOf("|") + 10);
    const participantsname = newpeoplePicker[i].AutoFillDisplayText;
    const isresolve = newpeoplePicker[i].IsResolved;


    if (isresolve) {
      $("#invalidusers").hide();

      var itemCreateInfo = new SP.ListItemCreationInformation();
      var oListItem = oList.addItem(itemCreateInfo);
      oListItem.set_item('Admin', targetUser);
      oListItem.set_item('Participants', participantsname);
      oListItem.set_item('Status', 'away');
      oListItem.set_item('IR_x0020_id', id);
      oListItem.set_item('Participants_x0020_username', participantsusername);
      oListItem.set_item('Admin_Name', currentUserCompleteName);
      oListItem.update();
      itemArray[i] = oListItem;
      clientContext.load(itemArray[i]);

    } else {
      $("#invalidusers").show();
    }
  }

  clientContext.executeQueryAsync(irlistvalidation2, onQueryFailed1);

}


function onQuerySucceeded1(irdata, hasChatdata) {

  $("#activeusers").empty();
  $("#descript_id").hide();
  $(".ui.comments").show();

  $(".ui.input").removeClass('error');

  // let newirdata = [...new Map(irdata.map(obj => [JSON.stringify(obj), obj])).values()];
  // console.log(newirdata);

  var html = "";
  for (let i = 0; i < irdata.length; i++) {
    html += `<div class="item">
                        <img class="ui avatar image" src="/SiteAssets/Scripts/HR Incident Report/PngItem_1468479.png">
                        <div class="content">
                            <div class="header">${irdata[i].Participants}</div>
                            <div class="description">
                                <a class="ui ${irdata[i].Status == 'active' ? 'green' : 'red'} empty circular label"></a>
                                ${irdata[i].Status}
                            </div>
                        </div>
                    </div>`;

    if (hasChatdata == 'no') {
      $("#add_loading").hide();
    }
  }

  document.getElementById("activeusers").innerHTML += html;

}


function onQueryFailed1(sender, args) {
  alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}


function chatfunc() {

  $(document).unbind("keyup").keyup(function (e) {
    var code = e.which; // recommended to use e.which, it's normalized across browsers
    if (code == 13) {
      send();
    }
  });

  $('#upload').change(function () {
    var file = $('#upload')[0].files[0];
    if (file) {
      $("#filename").text(file.name);
    }
  });

  var id = getQueryString()["ID"];
  $('#bodyChat').empty();
  $("#add_loading").show();
  $('.small.modal').modal('show');
  firebase.database().ref("message").off("child_added");

  var ref = firebase.database().ref("message");

  // attach listener for delete message
  ref.on("child_removed", function (snapshot) {
    $('#bodyChat').empty();
    removechatmessage();
  });

  // check if the firebase database is empty
  ref.once('value', function (snapshot) {

    var a = snapshot.exists();
    if (a) { //something wrong in this area
      snapshot.forEach(function (data) {
        if (data.val().irID != id) {
          irlistvalidation(hasChatdata = 'no');
        } else {
          irlistvalidation(hasChatdata = 'yes');
        }
      });
    } else {
      $("#add_loading").hide();
      irlistvalidation(hasChatdata = false);
    }

  });

  ref.on("child_added", function (snapshot) {

    if (snapshot.val().irID == id) {
      // $("#messreply").val('');
      let html = "";
      let delet = "";
      var start = moment(new Date());

      if (snapshot.val().sender == currentUserCompleteName) {
        delet += `<a onclick="deleteMessage('${snapshot.key}'); return false;" class='delete'>Delete</a>`;
      }

      html += `<div class='comment' id=${snapshot.val().id}>`;
      html += `<div class='content'>
              <a class='author'>${snapshot.val().sender}</a>
              <div class='metadata'>
                <span class='date'>${start.from(new Date(snapshot.val().createdAt))}</span>
              </div>
              <div class='text'>${snapshot.val().message}
              </div>
              <div class='actions'>
              ${delet}
              <a onclick="reply('${snapshot.val().sender}', '${snapshot.val().id}'); return false;" class='reply'>Reply</a>
              </div>
            </div>`;
      html += "</div>"
      document.getElementById("bodyChat").innerHTML += html;

      setTimeout(function () {
        // make auto scroll to the bottom
        var element = document.getElementById("bodyChat");
        element.scrollTop = element.scrollHeight;

        $("#add_loading").hide();
      }, 1000);

      var element = document.getElementById("bodyChat");
      element.scrollTop = element.scrollHeight;
    }

  });

  // get all files reference with id itself
  // var storageUrl = id + '-file';
  // var storageRef = firebase.storage().ref(storageUrl);
  // storageRef.listAll().then(function (result) {
  //   result.items.forEach(function (imageRef) {
  //     displayImage(imageRef);
  //   });
  // }).catch(function (error) {
  //   console.log(error);
  // });

  // function displayImage(imageRef) {
  //   imageRef.getDownloadURL().then(function (url) {
  //     console.log(url);
  //   }).catch(function (error) {
  //     console.log(error);
  //   });
  // }

  document.getElementById("messreply").focus();
}


function fileupload() {

}


function initializePeoplePicker(peoplePickerElementId, Users) {

  if (typeof (Users) == 'undefined') Users = null;
  var schema = {};
  schema['PrincipalAccountType'] = 'User';
  schema['SearchPrincipalSource'] = 15;
  schema['ResolvePrincipalSource'] = 15;
  schema['AllowMultipleValues'] = true;
  schema['MaximumEntitySuggestions'] = 50;
  schema['Width'] = '280px';
  this.SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, Users, schema);


  this.SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDiv_TopSpan.OnUserResolvedClientScript = function (peoplePickerId, selectedUsersInfo) {
    console.log('inside OnUserResolvedClientScript');
    var users = selectedUsersInfo;
    for (var i = 0; i < users.length - 1; i++) {
      if (users[users.length - 1].Key == users[i].Key) {
        alert("Duplicate participant selected!");
      }
    }
  };
}


function registerPPOnChangeEvent(ppElement) {
  var ppId = ppElement.attr('id') + "_TopSpan";

  if (SPClientPeoplePicker &&
    SPClientPeoplePicker.SPClientPeoplePickerDict &&
    SPClientPeoplePicker.SPClientPeoplePickerDict[ppId]) {

    var picker = SPClientPeoplePicker.SPClientPeoplePickerDict[ppId];
    picker.oldChanged = picker.OnControlResolvedUserChanged;
  }
}


var reply_id = "";

function reply(sender, id) {
  $('#messreply').val('@' + sender + ' ');
  document.getElementById("messreply").focus();
  reply_id = id;
}


function send() {
  var id = getQueryString()["ID"];
  var message = $("#messreply").val();

  if (!reply_id) {
    reply_id = 0
  }
  var currdate = new Date().toLocaleString();
  var file = $('#upload')[0].files[0];
  // var storage = firebase.storage().ref("message");
  // // var upload = storage.put(file.name);

  // // convert file to blob
  // var reader = new FileReader();
  // reader.onloadend = function (evt) {
  //   var blob = new Blob([evt.target.result]);

  //   var storageUrl = id + '-file/';
  //   var storageRef = firebase.storage().ref(storageUrl + file.name);
  //   var uploadTask = storageRef.put(blob);

  //   uploadTask.on(
  //     "state_changed",
  //     function progress(snapshot) {
  //       var percentage =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       document.getElementById("progress").value = percentage;
  //     },

  //     function error() {
  //       alert("error uploading file");
  //     },

  //     function complete() {
  //       // document.getElementById(
  //       //   "uploading"
  //       // ).innerHTML += `${file.name}`;
  //       console.log("Done");
  //     }
  //   );
  // }

  // reader.onerror = function (e) {
  //   console.log("Failed file read: " + e.toString());
  // };
  // reader.readAsArrayBuffer(file);

  if (message != "") {
    // post data
    firebase.database().ref("message").push().set({
      "id": uuidv4(),
      "irID": id,
      "sender": currentUserCompleteName,
      "message": message,
      "replyto": reply_id,
      "createdAt": currdate,
      "file": file ? file.name : ''
    });

    $("#messreply").val('');
    $("#upload").val('');
    $("#filename").text('');
    console.log("message is NOT empty");

  } else {
    console.log("message is empty");

    // if (file) {

    //   firebase.database().ref("message").push().set({
    //     "id": uuidv4(),
    //     "irID": id,
    //     "sender": currentUserCompleteName,
    //     "message": '',
    //     "replyto": reply_id,
    //     "createdAt": currdate,
    //     "file": file.name
    //   });

    $("#upload").val('');
    $("#filename").text('');
    // }

  }

  document.getElementById("messreply").focus();
}


function getFileUrl(filename) {
  //create a storage reference
  var storage = firebase.storage().ref(filename);

  //get file url
  storage
    .getDownloadURL()
    .then(function (url) {
      console.log(url);
    })
    .catch(function (error) {
      console.log("error encountered");
    });
  console.log(filename.text());

}


function deleteMessage(id) {
  firebase.database().ref("message").child(id).remove();
}


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


function userValidation(targetUser) {
  var id = getQueryString()["ID"];

  $.ajax({
    url: `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbyTitle('IR Chatbox')/items?$filter=IR_x0020_id eq ${id}`,
    type: "GET",
    headers: {
      "Accept": "application/json;odata=verbose",
      "content-type": "application/json;odata=verbose",
    },
    success: function (data) {
      for (let i = 0; i < data.d.results.length; i++) {
        if (data.d.results[i].Admin == targetUser) {
          document.getElementById("chatbutton_id").disabled = false;
        } else if (data.d.results[i].Participants_x0020_username == targetUser) {
          document.getElementById("chatbutton_id").disabled = false;
          if (data.d.results[i].Status == "away") {
            document.getElementById("chatbutton_id").onclick = function () {
              chatfunc_away(data.d.results[i].Id);
            };
          }
        } else {
          document.getElementById("chatbutton_id").disabled = true;
        }
      }
    },
    error: function (xhr, status, error) {
      console.log(xhr, status, error);
    }
  });
}


function chatfunc_away(id) {
  Swal.fire({
    title: "Sorry you're not active!",
    text: "You can set yourself as active by clicking the link to your email or choose the button below.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Not, this time!',
    confirmButtonText: 'Yes, set as active!'
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = `https://intranet.houseofit.com.au/Pages/setActiveinIRChatbox.aspx?item=${id}`;
    }
  })

}


function closemodal() {
  $('.small.modal').modal('hide');
}


function closeChat() {

  $('.ui.small.modal').modal({
    onApprove: function () {
      return false; //Return false as to not close modal dialog
    }
  }).modal('show');

  Swal.fire({
    title: "Are you sure you want to dismissed this chat session?",
    text: "You cannot revert this back all conversation, and participants will be deleted ",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Not, this time!',
    confirmButtonText: 'Yes, dismissed!'
  }).then((result) => {
    if (result.isConfirmed) {
      $('.ui.small.modal').modal('hide');

      var id = getQueryString()["ID"];

      firebase.database().ref("message").child(id).remove();

      var ref = firebase.database().ref("message"); //root reference to your data

      ref.once('value').then(function (snapshot) {
        var queryRef = ref.orderByChild('irID').equalTo(id)
        queryRef.on("value", function (querySnapshot) {
          querySnapshot.forEach(function (childSnapshot) {
            ref.child(childSnapshot.key).remove();
          });
        });
      });

      getItems(`/_api/web/lists/GetByTitle('IR Chatbox')/items?$filter=IR_x0020_id eq ${id}`).done(function (data) {
        var noChildItems = data.d.results.length; //number of child items to be deleted
        data.d.results.forEach(function (item) {
          var childId = item.ID;
          deleteItem("/_api/Web/Lists/GetByTitle('IR Chatbox')/getItemById(" + childId + ")", item).done(function (d_data) {
            console.log("deleted");
            window.location.reload(true);
          });
        });
      });

      Swal.fire(
        'Dismissed!',
        'Chatbox session has been dismissed',
        'success'
      )



    }
  });

}


//Get items
function getItems(url) {
  return $.ajax({
    url: _spPageContextInfo.webAbsoluteUrl + url,
    type: "GET",
    headers: {
      "accept": "application/json;odata=verbose",
    }
  });
}


//Delete Item
function deleteItem(url, oldItem) {
  return $.ajax({
    url: _spPageContextInfo.webAbsoluteUrl + url,
    type: "DELETE",
    headers: {
      "accept": "application/json;odata=verbose",
      "X-RequestDigest": $("#__REQUESTDIGEST").val(),
      "IF-MATCH": "*"
    }
  });
}