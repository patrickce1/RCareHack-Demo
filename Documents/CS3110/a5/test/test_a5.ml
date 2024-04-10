open QCheck
open OUnit2
open A5

let garden_1 = Garden.make_garden 1 10

(* Define a generator for plant records *)
let gen_plant : Plant.t Gen.t =
  let open Gen in
  let* cellid = small_int in
  return (Plant.make_plant cellid)

let gen_pot =
  let open Gen in
  let* cellid = small_int in
  return (Pot.make_pot cellid)

let gen_dimensions : (int * int) Gen.t =
  let open Gen in
  let* rows = small_int in
  let* cols = small_int in
  return (max rows 1, max cols 1)

(* QuickCheck test for checking if age is set correctly *)
let prop_set_age () =
  QCheck.Test.make ~name:"set_age" ~count:100 (QCheck.make gen_plant)
    (fun plant ->
      let new_age = Random.int 4 in
      Plant.set_age plant new_age;
      Plant.get_age plant = new_age)

(* QuickCheck test for checking if plant is created with correct age *)
let prop_make_plant () =
  QCheck.Test.make ~name:"make_plant" ~count:100 (QCheck.make Gen.small_int)
    (fun cellid ->
      let plant = Plant.make_plant cellid in
      Plant.get_cell_id plant = cellid && Plant.get_age plant = 0)

(* Convert QuickCheck test to OUnit test *)
let prop_make_pot () =
  QCheck.Test.make ~name:"make_pot" ~count:100 (QCheck.make gen_pot) (fun pot ->
      match Pot.get_plant pot with
      | None -> true
      | Some plant -> Plant.get_cell_id plant = Pot.get_cellid pot)

let prop_create_plant () =
  QCheck.Test.make ~name:"create_plant" ~count:100 (QCheck.make gen_pot)
    (fun pot ->
      Pot.create_plant pot;
      match Pot.get_plant pot with
      | None ->
          false
          (* Plant should be created and not None after calling create_plant *)
      | Some plant -> Plant.get_age plant = 0)
(* Newly created plant should have age 0 *)

(* QuickCheck test for update_pot *)
let prop_update_pot () =
  QCheck.Test.make ~name:"update_pot" ~count:100 (QCheck.make gen_pot)
    (fun pot ->
      let old_plant = Pot.get_plant pot in
      Pot.update_pot pot;
      match (old_plant, Pot.get_plant pot) with
      | None, None -> true (* No plant to update *)
      | Some old_plant, Some new_plant ->
          (* If plant was present, its age should be updated *)
          Plant.get_age old_plant <= Plant.get_age new_plant
      | None, Some new_plant -> Plant.get_age new_plant = 0
      | _ -> false)

let prop_make_garden () =
  QCheck.Test.make ~name:"make_garden" ~count:100 (QCheck.make gen_dimensions)
    (fun (rows, cols) ->
      let garden = Garden.make_garden rows cols in
      Array.length (Garden.get_garden garden) = rows
      && Array.length (Garden.get_garden garden).(0) = cols)

(* Test suite *)
let suite =
  "Tests for all modules"
  >::: [
         QCheck_runner.to_ounit2_test (prop_set_age ());
         QCheck_runner.to_ounit2_test (prop_make_plant ());
         QCheck_runner.to_ounit2_test (prop_make_pot ());
         QCheck_runner.to_ounit2_test (prop_create_plant ());
         QCheck_runner.to_ounit2_test (prop_update_pot ());
         QCheck_runner.to_ounit2_test (prop_make_garden ());
         ( "Test pots in make_garden" >:: fun _ ->
           assert_equal "1 , 10"
             (string_of_int (Array.length (Garden.get_garden garden_1))
             ^ " , "
             ^ string_of_int
                 (Array.length (Array.get (Garden.get_garden garden_1) 0))) );
       ]

let _ = OUnit2.run_test_tt_main suite
