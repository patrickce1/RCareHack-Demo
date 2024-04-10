module Garden = A5.Garden

(* let rec loop rate ctr = Printf.printf "%i\n%!" ctr; Unix.sleepf rate; loop
   rate (ctr + 1) *)

let rec print_horizontal num =
  match num with
  | 0 -> ()
  | num ->
      print_string "-";
      print_horizontal (num - 1)

let rec update_game garden fps columns gen =
  Unix.sleepf fps;
  Garden.update_all_pots garden;
  print_newline ();
  print_endline ("Generation " ^ string_of_int gen);
  print_newline ();
  print_horizontal ((4 * columns) + 2);
  print_newline ();
  Garden.print_garden garden columns;
  print_newline ();
  print_horizontal ((4 * columns) + 2);
  update_game garden fps columns (gen + 1)

let start_game rows columns fps =
  begin
    Random.self_init ();
    let garden = Garden.make_garden rows columns in
    print_endline "Generation 0";
    print_horizontal ((4 * columns) + 2);
    print_newline ();
    Garden.print_garden garden columns;
    print_newline ();
    print_horizontal ((4 * columns) + 2);
    let gen = 1 in
    update_game garden fps columns gen
  end

let help_message () =
  print_endline " You have entered the help portal for my application";
  print_newline ();
  print_endline
    " To understand what is printing on the screen, you need to note a few \
     things:";
  print_endline " 1. Generations:";
  print_newline ();
  print_endline
    "    Here, at the start of each garden print, you see the tag 'Generation' \
     with a number attached to it.";
  print_endline
    "    This helps to tell you tell you what current generation you are \
     looking at in the simulation.";
  print_newline ();
  print_endline " 2. Emoji's :";
  print_newline ();
  print_endline "     Here, Different emoji's different the state of a plant.";
  print_endline
    "     If a plant has not yet been grown, or has died, it is represented as \
     a blank space";
  print_endline
    "     If a plant has just been planted, and is still a seedling, it is \
     represented as 🌱";
  print_endline
    "     If a plant has begun growing flowers and is in its teenager stage, \
     it looks like 🌸";
  print_endline "     Fianlly, if the plant is an adult, it is represented as 🥀";
  print_newline ();
  print_newline ();
  print_endline
    "Now, you will see the simulation run with 10 rows, 10 columns and 1 fps.";
  print_newline ();
  print_newline ();
  start_game 10 10 1.

let () =
  let get_list_args : string list = Array.to_list Sys.argv in
  if List.length get_list_args = 4 then
    let rows = int_of_string (List.nth get_list_args 1) in
    let columns = int_of_string (List.nth get_list_args 2) in
    let fps = 1. /. float_of_string (List.nth get_list_args 3) in
    start_game rows columns fps
  else begin
    help_message ()
  end
