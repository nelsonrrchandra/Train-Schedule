$(document).ready(function() {

    var config = {
        apiKey: "AIzaSyCCj0-3DFWplXqAtuq-8Ppn0PjXKXfOwb4",
        authDomain: "train-schedule-ae260.firebaseapp.com",
        databaseURL: "https://train-schedule-ae260.firebaseio.com",
        projectId: "train-schedule-ae260",
        storageBucket: "",
        messagingSenderId: "944574872497"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    var trainRef = database.ref("/trains");

    $("#addTrain").on("submit", function(event) {
        event.preventDefault();

        trainRef.push({
            trainName: event.target.trainName.value.trim(),
            destination: event.target.destination.value.trim(),
            firstTrain: moment().format(event.target.firstTrain.value, "hh,mm"),
            frequency: moment().format(event.target.frequency.value, "hh:mm")
        });

        event.target.reset();
    });

trainRef.on("child_added", function(childSnapshot) {

	var tFrequency = childSnapshot.val().frequency;
    var firstTime = childSnapshot.val().firstTrain;
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "days");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % tFrequency;
    var tMinutesTillTrain = tFrequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

	var row = $("<tr>").attr("id", childSnapshot.key);
	var name = $("<th>").attr("scope", "row").text(childSnapshot.val().trainName);
	var dest = $("<td>").text(childSnapshot.val().destination);
	var first = $("<td>").text(moment(firstTime, "hh:mm").format("H:mm"));
	var freq = $("<td>").text(moment(tFrequency, "hh:mm").format("H:mm"));
	var next= $("<td>").text(moment(nextTrain).format("H:mm"));
	var remove= $("<td>");
	var button= $("<button>").addClass("remove").text("X").attr("data-key", childSnapshot.key);
	remove.append(button);

	row.append(name).append(dest).append(first).append(freq).append(next).append(remove);
	$("#trains").append(row);
});

$(document).on("click", ".remove", function(event){
	trainRef.child(this.dataset.key).remove();
	$("#"+this.dataset.key).remove();
});

    /////////////end
});