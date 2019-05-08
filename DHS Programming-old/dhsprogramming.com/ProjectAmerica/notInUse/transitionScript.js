var selection;
$(document).ready(function(){
    var selection = gameSetup(); //era id, events booleans, length id

});

function gameSetup(){
    $(".eraOption").click(function(){
        
        var era = this.id;
        
        $(".eraOption").hide();
        $(".settings").show();
        
        $(".goButton").click(function(){
            var battles = $('#battles')[0].checked;
            var inventions = $('#inventions')[0].checked;
            var elections = $('#elections')[0].checked;
            var court = $('#court')[0].checked;
            var other = $('#other')[0].checked;
            var length = $('input[name="length"]:checked', '#lengthForm').val();
            var choice = [era, battles, inventions, elections, court, other, length];
            alert(choice);
            $(".pregame").hide();
            $(document.body).css('background-image','url(img/CrossingDelaware.jpg)');
            $(".game").show();
            return choice;
        });
    });

}
