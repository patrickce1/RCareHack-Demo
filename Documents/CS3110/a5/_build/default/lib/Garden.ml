type t = Pot.t array array

let rec print_horizontal num =
  match num with
  | 0 -> ()
  | num ->
      print_string "-";
      print_horizontal (num - 1)

let rec make_pots num list =
  match num with
  | 0 -> list
  | _ ->
      let new_list = Pot.make_pot num :: list in
      make_pots (num - 1) new_list

let rec drop_first_n_elements n lst =
  if n <= 0 then lst
  else if n >= List.length lst then []
  else
    match lst with
    | [] -> []
    | _ :: rest -> drop_first_n_elements (n - 1) rest

let rec split_list_helper num list ret_list =
  match (num, list) with
  | 0, _ -> ret_list
  | _, [] -> ret_list
  | _, hd :: tl ->
      let ret_list = ret_list @ [ hd ] in
      split_list_helper (num - 1) tl ret_list

let rec split_into_sublists counter cols lst ret_list =
  match counter with
  | 0 -> ret_list
  | _ ->
      let sublist = split_list_helper cols lst [] in
      let updated_ret_list = ret_list @ [ sublist ] in
      (* Wrap sublist in its own list *)
      split_into_sublists (counter - 1) cols
        (drop_first_n_elements cols lst)
        updated_ret_list

let rec nested_list_to_nested_array lst =
  match lst with
  | [] -> [||]
  | hd :: tl ->
      let inner_array = Array.of_list hd in
      let outer_array =
        Array.append [| inner_array |] (nested_list_to_nested_array tl)
      in
      outer_array

let make_garden rows cols : t =
  nested_list_to_nested_array
    (split_into_sublists rows cols (make_pots (rows * cols) []) [])

let rec print_garden_helper pot_list_list cols counter =
  match pot_list_list with
  | [] -> ()
  | pot_list :: rest ->
      let rec print_pot_list_on_same_line pot_list cols =
        match pot_list with
        | [] -> ()
        | h :: t ->
            if List.length t = cols - 1 then print_string "|" else ();
            Pot.print_pot h;
            if List.length t = 0 then print_string "|" else ();
            print_pot_list_on_same_line t cols
      in

      print_pot_list_on_same_line pot_list cols;
      print_newline ();
      print_horizontal ((4 * cols) + 2);
      print_newline ();
      print_garden_helper rest cols (counter + 1)

let nested_array_to_nested_list arr =
  Array.to_list (Array.map (fun subarr -> Array.to_list subarr) arr)

let print_garden garden cols =
  print_garden_helper (nested_array_to_nested_list garden) cols 0

let update_all_pots pot_list_list =
  List.iter
    (fun pot_list ->
      List.iter (fun pot -> Pot.update_pot pot) (Array.to_list pot_list))
    (Array.to_list pot_list_list)

let get_garden garden = garden
