type t

val get_plant : t -> Plant.t option
val get_cellid : t -> int
val create_plant : t -> unit
val make_pot : int -> t
val print_pot : t -> unit
val update_pot : t -> unit
