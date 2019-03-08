function dragManager(){
    
        $( ".option" ).draggable({
            containment: "window",
            scroll: false
        });
    
        q1=false;
        q2=false;

    $(".answerBox1").droppable({
        accept: ".optionA",
        activeClass:"answerBox1Active",
        tolerance: "touch",
        drop: function(event, ui) {
            if(isCorrect("#"+ui.draggable.attr("id"))){
                q1=true;
                $(this).addClass( "answerBox1Dropped" );
                ui.draggable.position({
                    my: "center",
                    at: "center",
                    of: $(this)
                    });
                
                $(ui.draggable).removeClass("floating");

                setTimeout($("#"+ui.draggable.attr("id")).draggable( "destroy" ),50);
                if(q2){ //If other question was also answered correctly, go to next set
                    questionSetup();
                }

            }
            else{
                $("#"+ui.draggable.attr("id")).draggable({ revert: "valid" });
                numWrong++;
            }

      }
      });

      $(".answerBox2").droppable({
        accept: ".optionB",
        activeClass:"answerBox2Active",
        drop: function(event, ui) {
            if(isCorrect("#"+ui.draggable.attr("id"))){
                q2=true;
                $(this).addClass( "answerBox2Dropped" )
                ui.draggable.position({
                    my: "center",
                    at: "center",
                    of: $(this)
                    });
                
                $(ui.draggable).removeClass("floating");
                
                setTimeout($("#"+ui.draggable.attr("id")).draggable( "destroy" ),50);
                
                if(q1){
                    questionSetup();
                }

            }
            else{
                $("#"+ui.draggable.attr("id")).draggable({ revert: "valid" });
                numWrong++;
            }

        }
    });
}