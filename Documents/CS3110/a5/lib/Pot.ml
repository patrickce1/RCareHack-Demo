type t = {
  mutable plant : Plant.t option;
  cellid : int;
}

let get_plant pot = pot.plant
let create_plant pot = pot.plant <- Some (Plant.make_plant pot.cellid)
let get_cellid pot = pot.cellid

let make_pot cellid =
  {
    plant = (if Random.bool () then Some (Plant.make_plant cellid) else None);
    cellid;
  }

let print_pot pot =
  match pot.plant with
  | None -> print_string "|  |"
  | Some plant -> Plant.print_plant plant

let update_pot pot =
  match pot.plant with
  | None ->
      if Random.bool () then pot.plant <- Some (Plant.make_plant pot.cellid)
  | Some plant ->
      if Random.bool () then
        Plant.set_age plant ((Plant.get_age plant + 1) mod 4)
