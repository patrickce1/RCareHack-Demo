type t

val make_garden : int -> int -> t
val print_garden : t -> int -> unit
val update_all_pots : t -> unit
val get_garden : t -> Pot.t array array
