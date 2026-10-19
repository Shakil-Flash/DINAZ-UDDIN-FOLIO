import { SldEquipmentNode, SldLegendItem } from "@/types/sld";

/**
 * Educational Single-Line Diagram (SLD) Configuration
 *
 * NOTE:
 * - This dataset is an educational model of a radial industrial distribution substation.
 * - It is strictly a conceptual study aid and does NOT represent certified site calculations
 *   or an active installation.
 */
export const sldEquipmentNodes: SldEquipmentNode[] = [
  {
    id: "grid_intake",
    tag: "GRID-11KV",
    name: "Medium Voltage Utility Incomer",
    category: "grid",
    voltageRating: "11 kV, 3-Phase, 50 Hz",
    generalPurpose:
      "Primary grid intake delivering medium-voltage utility electrical energy to the facility substation.",
    technicalExplanation:
      "Serves as the point of common coupling (PCC) between utility distribution feeders and the private industrial consumer facility. Protected by incoming surge arresters to dampen lightning and switching overvoltages.",
    standardReference: "IEC 60038 / IEEE 141",
    keySpecs: [
      "Three-Phase Three-Wire",
      "Point of Common Coupling",
      "Surge Arresters (SPD)",
      "High-Voltage Line Disconnect",
    ],
  },
  {
    id: "vcb_01",
    tag: "VCB-01",
    name: "Vacuum Circuit Breaker (HT Incomer)",
    category: "mv_switchgear",
    voltageRating: "11 kV Rated",
    generalPurpose:
      "Primary medium-voltage circuit interruption, fault isolation, and safe substation switching.",
    technicalExplanation:
      "Utilizes vacuum bottles as the arc extinction medium. Provides high dielectric recovery speed and extended contact life for high-voltage fault clearances before energy enters the step-down transformer.",
    standardReference: "IEC 62271-100",
    keySpecs: [
      "Vacuum Arc Extinction",
      "Protective Relay Trip Coil",
      "Integrated Earthing Switch",
      "Draw-out Cassette Design",
    ],
  },
  {
    id: "tx_01",
    tag: "TX-01",
    name: "Step-Down Distribution Transformer",
    category: "transformer",
    voltageRating: "11 kV / 415 V (Dyn11)",
    generalPurpose:
      "Steps down 11kV medium voltage to 415V three-phase line-to-line (240V line-to-neutral) utilization voltage.",
    technicalExplanation:
      "Delta primary isolates zero-sequence third harmonics; Wye secondary supplies a neutral point that is solidly grounded to facility earth pits. Dyn11 configuration provides a 30-degree phase lead on LV terminals.",
    standardReference: "IEC 60076",
    keySpecs: [
      "Vector Group: Dyn11",
      "Oil-immersed / Dry-type",
      "Neutral Earthing Terminal",
      "Buchholz & Thermal Sensor Ports",
    ],
  },
  {
    id: "acb_01",
    tag: "ACB-01",
    name: "Main Air Circuit Breaker (LV Incomer)",
    category: "lv_incomer",
    voltageRating: "415 V, 3P / 4P Rated",
    generalPurpose:
      "Main low-voltage switchboard intake breaker controlling power distribution from the secondary winding.",
    technicalExplanation:
      "Equipped with microprocessor-based protection trip units handling Long-time (overload), Short-time (selective delay), Instantaneous (short circuit), and Ground fault protection (LSIG settings).",
    standardReference: "IEC 60947-2",
    keySpecs: [
      "Microprocessor LSIG Tripping",
      "Motorized Charging Spring",
      "Interlocked with HT VCB",
      "Shunt & Under-Voltage Releases",
    ],
  },
  {
    id: "bus_main",
    tag: "BUS-415V",
    name: "Main Low Voltage Distribution Busbar",
    category: "busbar",
    voltageRating: "415 V (L-L) / 240 V (L-N)",
    generalPurpose:
      "High-conductivity solid conductor assembly routing bulk current across branch feeder protective devices.",
    technicalExplanation:
      "Manufactured from high-purity electrolytic tough pitch (ETP) copper or electrical-grade aluminum. Braced mechanically to withstand extreme electromagnetic repulsion forces during maximum prospective short-circuit faults.",
    standardReference: "IEC 61439-1 / 2",
    keySpecs: [
      "Three-Phase + Neutral (TPN)",
      "Short-Circuit Braced Supports",
      "Thermal Insulation Sleeving",
      "Standard Color Identification",
    ],
  },
  {
    id: "mccb_fd1",
    tag: "MCCB-FD1",
    name: "Motor Control Center Feeder Breaker",
    category: "feeder",
    voltageRating: "415 V Rated",
    generalPurpose:
      "Dedicated branch protection for industrial motor control centers, pump stations, and dynamic inductive drives.",
    technicalExplanation:
      "Molded-case circuit breaker with thermal-magnetic or electronic release. Sized to tolerate motor starting inrush transients without nuisance tripping while providing rapid electromagnetic clearance during locked-rotor faults.",
    standardReference: "IEC 60947-2",
    keySpecs: [
      "Motor Protection Curve",
      "Adjustable Thermal Margin",
      "Auxiliary Status Contacts",
      "Rotary Door-Interlocked Handle",
    ],
  },
  {
    id: "mccb_fd2",
    tag: "MCCB-FD2",
    name: "Lighting & Essential Utilities Feeder",
    category: "feeder",
    voltageRating: "415 V / 240 V Rated",
    generalPurpose:
      "Sub-distribution feeder supplying single-phase lighting circuits, ventilation, instrumentation, and receptacle panels.",
    technicalExplanation:
      "Distributes load across phases R, Y, B to minimize neutral current return and avoid unbalance. Coordinates selectively with downstream branch MCBs to localize faults without disconnecting upstream switchboards.",
    standardReference: "IEC 60947-2",
    keySpecs: [
      "Balanced Phase Distribution",
      "Neutral Disconnection Support",
      "Cascaded Protection Grading",
      "High Breaking Capacity (Icu)",
    ],
  },
  {
    id: "apfc_bank",
    tag: "APFC-01",
    name: "Automatic Power Factor Correction Bank",
    category: "pfc",
    voltageRating: "415 V Rated Shunt Bank",
    generalPurpose:
      "Supplies capacitive reactive power (kVAR) to offset inductive lagging currents from transformers and motors.",
    technicalExplanation:
      "Monitored by a micro-controller APFC relay calculating active (P) and reactive (Q) power vectors. Steps shunt capacitor stages in and out automatically, maintaining power factor above 0.95 to eliminate utility penalties.",
    standardReference: "IEC 61921 / IEC 60831",
    keySpecs: [
      "Microprocessor APFC Controller",
      "Detuned Harmonic Reactors (7%)",
      "Discharge Resistor Networks",
      "Specialized Inrush Duty Contactors",
    ],
  },
];

export const sldLegendItems: SldLegendItem[] = [
  {
    id: "leg-cb",
    name: "Circuit Breaker",
    description: "Square symbol with status cross representing circuit breakers (VCB, ACB, MCCB) for automatic fault interruption.",
    symbolType: "breaker",
  },
  {
    id: "leg-tx",
    name: "Step-Down Transformer",
    description: "Two interlocking circles representing magnetic coupling between primary and secondary winding phases.",
    symbolType: "transformer",
  },
  {
    id: "leg-bus",
    name: "Electrical Busbar",
    description: "Thick horizontal conductor line representing the main distribution node feeding downstream circuits.",
    symbolType: "busbar",
  },
  {
    id: "leg-earth",
    name: "Protective Ground / Earth",
    description: "Descending horizontal lines indicating direct low-impedance connection to facility earthing pits.",
    symbolType: "earth",
  },
  {
    id: "leg-pfc",
    name: "Capacitor / PFC Bank",
    description: "Parallel plate symbol representing reactive power compensation equipment.",
    symbolType: "capacitor",
  },
];
