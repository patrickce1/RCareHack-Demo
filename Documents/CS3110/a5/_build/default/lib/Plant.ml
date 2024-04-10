type t = {
  cellid : int;
  mutable age : int;
}

let get_cell_id plant = plant.cellid
let get_age plant = plant.age
let set_age plant age = plant.age <- age

let print_plant plant =
  match get_age plant with
  | 0 -> print_string "|🌱|"
  | 1 -> print_string "|🌸|"
  | 2 -> print_string "|🥀|"
  | 3 -> print_string "|  |"
  | _ -> ()

let make_plant cellid : t = { cellid; age = 0 }
