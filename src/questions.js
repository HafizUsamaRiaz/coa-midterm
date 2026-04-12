// ================================================================
//  CE203L: Computer Organization & Architecture Lab
//  MIDTERM EXAM — Labs 1–6
//  Section A: MCQ (10 Qs) | Section B: Code Reading (8 Qs) | Section C: Fill-in-Blank (7 Qs)
// ================================================================

// ── SECTION A: Concept MCQs ────────────────────────────────────
export const SECTION_A = [
  {
    id: "A1", section: "A", lab: "Lab 1",
    type: "mcq",
    question: "Verilog HDL can describe designs at four levels of abstraction. Which of the following is NOT one of them?",
    options: [
      "Algorithmic level",
      "Register Transfer Level (RTL)",
      "Compilation level",
      "Switch level"
    ],
    answer: "Compilation level",
    explanation: "The four levels are: Algorithmic, Register Transfer Level (RTL), Gate Level, and Switch Level. Compilation is not a design abstraction level in Verilog."
  },
  {
    id: "A2", section: "A", lab: "Lab 1",
    type: "mcq",
    question: "Xilinx Vivado is primarily used for designing and implementing:",
    options: [
      "Microcontroller firmware in C",
      "FPGA designs using HDLs like Verilog and VHDL",
      "Operating system kernels",
      "PCB schematics only"
    ],
    answer: "FPGA designs using HDLs like Verilog and VHDL",
    explanation: "Vivado is Xilinx's design suite for FPGA development. It supports Verilog, VHDL, and high-level synthesis from C/C++."
  },
  {
    id: "A3", section: "A", lab: "Lab 2",
    type: "mcq",
    question: "A 32-bit multiplexer has 32 input lines. How many select lines does it need?",
    options: ["4", "5", "6", "8"],
    answer: "5",
    explanation: "To select one of 32 inputs, you need log₂(32) = 5 select lines. Each combination of 5 bits selects one of 32 inputs."
  },
  {
    id: "A4", section: "A", lab: "Lab 2",
    type: "mcq",
    question: "In hierarchical design, a 5-to-32 bit decoder is built from smaller sub-modules. Which combination is used?",
    options: [
      "Two 3-to-8 decoders only",
      "Two 4-to-16 decoders and one 1-to-2 decoder",
      "Four 2-to-4 decoders",
      "One 4-to-16 decoder and one 3-to-8 decoder"
    ],
    answer: "Two 4-to-16 decoders and one 1-to-2 decoder",
    explanation: "The hierarchical approach: 1-to-2 decoder enables one of two 4-to-16 decoders, together covering all 32 output lines."
  },
  {
    id: "A5", section: "A", lab: "Lab 3",
    type: "mcq",
    question: "A 1-bit Full Adder takes three inputs: A, B, and Cin. When A=1, B=1, Cin=1, what are the outputs Sum and Cout?",
    options: [
      "Sum=0, Cout=0",
      "Sum=1, Cout=1",
      "Sum=0, Cout=1",  // wait — 1+1+1 = 3 = 11b, so Sum=1 Cout=1
      "Sum=1, Cout=0"
    ],
    answer: "Sum=1, Cout=1",
    explanation: "1+1+1 = 3 in decimal = 11 in binary. So Sum (LSB) = 1 and Cout (MSB) = 1."
  },
  {
    id: "A6", section: "A", lab: "Lab 4",
    type: "mcq",
    question: "In behavioral modeling, which block is used to initialize signals ONCE at the start of simulation (not synthesizable)?",
    options: ["always block", "assign block", "initial block", "forever block"],
    answer: "initial block",
    explanation: "The 'initial' block executes once at simulation start and is used for initialization in testbenches. It is not synthesizable. The 'always' block runs continuously."
  },
  {
    id: "A7", section: "A", lab: "Lab 4",
    type: "mcq",
    question: "A 4×8 ROM has a 2-bit address input. How many memory locations does it have?",
    options: ["4", "8", "16", "32"],
    answer: "4",
    explanation: "A 4×8 ROM has 4 locations (2-bit address → 2² = 4), each storing 8 bits of data. The notation is locations × data_width."
  },
  {
    id: "A8", section: "A", lab: "Lab 5",
    type: "mcq",
    question: "What is the difference between synchronous and asynchronous reset in Verilog?",
    options: [
      "Synchronous reset triggers on any signal change; asynchronous reset triggers on clock edge",
      "Synchronous reset is checked only at clock edge; asynchronous reset triggers immediately regardless of clock",
      "Both trigger on clock edge but synchronous uses posedge, asynchronous uses negedge",
      "There is no functional difference, only a naming convention"
    ],
    answer: "Synchronous reset is checked only at clock edge; asynchronous reset triggers immediately regardless of clock",
    explanation: "Synchronous: always@(posedge clk) — reset only takes effect at clock edge. Asynchronous: always@(posedge clk or negedge rst) — reset triggers immediately when asserted."
  },
  {
    id: "A9", section: "A", lab: "Lab 6",
    type: "mcq",
    question: "In the Lab 6 Register File, the Reset pin is active-low. What does this mean?",
    options: [
      "The register file resets when Reset = 1",
      "The register file resets when Reset = 0",
      "Reset only works on the positive clock edge",
      "Reset clears only the destination register, not all registers"
    ],
    answer: "The register file resets when Reset = 0",
    explanation: "Active-low means the signal is asserted (active) when it is logic 0. So !Reset being true (Reset=0) triggers the reset of the entire register file."
  },
  {
    id: "A10", section: "A", lab: "Lab 6",
    type: "mcq",
    question: "In the Lab 6 ALU, after performing any operation, the Zero_Flag is set to 1 when:",
    options: [
      "Din_A equals Din_B",
      "The result D_Out equals zero",
      "The opcode is 3'b000 (addition)",
      "Din_A equals zero"
    ],
    answer: "The result D_Out equals zero",
    explanation: "The Zero_Flag is set ON whenever the operation result (D_Out) is zero, regardless of the opcode. This is used in processors for branch decisions."
  },

  // ── SECTION B: Code Reading ────────────────────────────────────
];

export const SECTION_B = [
  {
    id: "B1", section: "B", lab: "Lab 1",
    type: "code_reading",
    question: "What does the following Verilog assign statement implement?",
    code: `module even_detector(
  input  [3:0] a,
  output       even
);
  assign even = ~a[0];
endmodule`,
    options: [
      "Outputs 1 if ALL bits of 'a' are zero",
      "Outputs 1 if the number 'a' is even (LSB is 0)",
      "Outputs 1 if the number 'a' is odd",
      "Outputs the bitwise NOT of all 4 bits"
    ],
    answer: "Outputs 1 if the number 'a' is even (LSB is 0)",
    explanation: "A number is even when its least significant bit (bit 0) is 0. ~a[0] inverts the LSB — so even=1 when a[0]=0, meaning the number is even."
  },
  {
    id: "B2", section: "B", lab: "Lab 2",
    type: "code_reading",
    question: "What will 'out' be when sel=2'b10 in this MUX?",
    code: `module mux4(
  input      i0, i1, i2, i3,
  input[1:0] sel,
  output reg out
);
  always @(*) begin
    case(sel)
      2'b00: out = i0;
      2'b01: out = i1;
      2'b10: out = i2;
      2'b11: out = i3;
    endcase
  end
endmodule`,
    options: [
      "out = i0",
      "out = i1",
      "out = i2",
      "out = i3"
    ],
    answer: "out = i2",
    explanation: "sel=2'b10 matches the third case, so out = i2. The case statement selects the input whose case label matches sel."
  },
  {
    id: "B3", section: "B", lab: "Lab 3",
    type: "code_reading",
    question: "What are the values of Sum and Cout when A=1, B=0, Cin=1?",
    code: `module full_adder(
  input  A, B, Cin,
  output Sum, Cout
);
  assign Sum  = A ^ B ^ Cin;
  assign Cout = (A & B) | (B & Cin) | (A & Cin);
endmodule`,
    options: [
      "Sum=0, Cout=0",
      "Sum=0, Cout=1",
      "Sum=1, Cout=0",
      "Sum=1, Cout=1"
    ],
    answer: "Sum=0, Cout=1",
    explanation: "Sum = 1^0^1 = 0. Cout = (1&0)|(0&1)|(1&1) = 0|0|1 = 1. So 1+0+1 = 10 in binary → Sum=0, Cout=1."
  },
  {
    id: "B4", section: "B", lab: "Lab 4",
    type: "code_reading",
    question: "What type of memory does this Verilog code implement, and what is its size?",
    code: `module memory(
  input      [3:0] addr,
  input      [7:0] data_in,
  input            we, clk,
  output reg [7:0] data_out
);
  reg [7:0] mem [0:15];
  always @(posedge clk) begin
    if (we) mem[addr] <= data_in;
    else    data_out  <= mem[addr];
  end
endmodule`,
    options: [
      "ROM — 4×8 (4 locations, 8-bit wide)",
      "RAM — 16×8 (16 locations, 8-bit wide)",
      "ROM — 16×8 (16 locations, 8-bit wide)",
      "RAM — 4×8 (4 locations, 8-bit wide)"
    ],
    answer: "RAM — 16×8 (16 locations, 8-bit wide)",
    explanation: "It is RAM because it supports both read (we=0) and write (we=1). The 4-bit address gives 2⁴=16 locations, each 8 bits wide → 16×8 RAM."
  },
  {
    id: "B5", section: "B", lab: "Lab 5",
    type: "code_reading",
    question: "What happens to q when rst goes LOW (0) during this D Flip-Flop's operation?",
    code: `module dff(
  input  clk, rst, d,
  output reg q
);
  always @(posedge clk or negedge rst) begin
    if (!rst)
      q <= 1'b0;
    else
      q <= d;
  end
endmodule`,
    options: [
      "q is set to 1 immediately",
      "q is cleared to 0 immediately, regardless of clock",
      "q is cleared to 0 only on the next rising clock edge",
      "Nothing — rst has no effect on q"
    ],
    answer: "q is cleared to 0 immediately, regardless of clock",
    explanation: "This is an asynchronous reset (negedge rst in sensitivity list). When rst=0, !rst is true and q<=0 executes immediately — no clock edge needed."
  },
  {
    id: "B6", section: "B", lab: "Lab 5",
    type: "code_reading",
    question: "After 3 clock cycles with sel=2'b01 and no reset, what is data_out if data_out starts at 4'b1010?",
    code: `module shift_reg(
  input        clk, rst,
  input  [1:0] sel,
  input  [3:0] data_in,
  output reg [3:0] data_out
);
  always @(posedge clk or negedge rst) begin
    if (!rst) data_out <= 4'b0000;
    else case(sel)
      2'b00: data_out <= data_out;        // No change
      2'b01: data_out <= data_out << 1;   // Shift Left
      2'b10: data_out <= data_out >> 1;   // Shift Right
      2'b11: data_out <= data_in;         // Load
    endcase
  end
endmodule`,
    options: [
      "4'b1010 (unchanged)",
      "4'b0100",
      "4'b0000",
      "4'b0010"
    ],
    answer: "4'b0000",
    explanation: "sel=2'b01 is Shift Left. Cycle 1: 1010<<1 = 0100. Cycle 2: 0100<<1 = 1000. Cycle 3: 1000<<1 = 0000 (MSB shifts out, 0 fills LSB). Result = 4'b0000."
  },
  {
    id: "B7", section: "B", lab: "Lab 6",
    type: "code_reading",
    question: "What operation does this ALU perform when opcode = 3'b101, and what is D_Out if Din_A = 8'hAA?",
    code: `always @(*) begin
  case(opcode)
    3'b000: D_Out = Din_A + Din_B;
    3'b001: D_Out = Din_B - Din_A;
    3'b010: D_Out = Din_A * Din_B;
    3'b011: D_Out = Din_A & Din_B;
    3'b100: D_Out = Din_A | Din_B;
    3'b101: D_Out = ~Din_A;
    3'b110: D_Out = Din_A >> 1;
    3'b111: D_Out = Din_A << 1;
  endcase
  Zero_Flag = (D_Out == 8'b0);
end`,
    options: [
      "Bitwise AND; D_Out = 8'h55",
      "Bitwise NOT; D_Out = 8'h55",
      "Bitwise OR; D_Out = 8'hFF",
      "Left Shift; D_Out = 8'h54"
    ],
    answer: "Bitwise NOT; D_Out = 8'h55",
    explanation: "3'b101 maps to ~Din_A (bitwise NOT). 8'hAA = 10101010b. NOT of that = 01010101b = 8'h55."
  },
  {
    id: "B8", section: "B", lab: "Lab 6",
    type: "code_reading",
    question: "What does this Register File code do on the positive clock edge when Write=1 and DA=2'b01?",
    code: `module reg_file(
  input        clk, rst, Write,
  input  [1:0] DA, AA, BA,
  input  [7:0] Din,
  output [7:0] Dout_A, Dout_B
);
  reg [7:0] regs [0:3];

  always @(posedge clk or negedge rst) begin
    if (!rst)
      regs[0]<=0; regs[1]<=0; regs[2]<=0; regs[3]<=0;
    else if (Write)
      regs[DA] <= Din;
  end

  assign Dout_A = regs[AA];
  assign Dout_B = regs[BB];
endmodule`,
    options: [
      "Reads data from register 1 and outputs on Dout_A",
      "Writes Din into register 1 (regs[1])",
      "Resets all registers to 0",
      "Writes Din into register 0 (regs[0])"
    ],
    answer: "Writes Din into register 1 (regs[1])",
    explanation: "When Write=1, the else-if branch executes: regs[DA] <= Din. With DA=2'b01, this writes Din into regs[1] — register number 1."
  },
];

export const SECTION_C = [
  {
    id: "C1", section: "C", lab: "Lab 1",
    type: "fill_blank",
    question: "Complete the Verilog module declaration for a 1-bit equality comparator that outputs 1 when inputs a and b are equal:",
    code: `module comparator(
  input  a, b,
  output equal
);
  assign equal = ___(A);
endmodule`,
    blank_label: "Fill in the blank (A)",
    options: [
      "a & b",
      "a | b",
      "~(a ^ b)",
      "a ^ b"
    ],
    answer: "~(a ^ b)",
    explanation: "XOR (^) outputs 1 when inputs DIFFER. So NOT-XOR (~^) outputs 1 when inputs are EQUAL. This is the XNOR operation — perfect for equality comparison."
  },
  {
    id: "C2", section: "C", lab: "Lab 2",
    type: "fill_blank",
    question: "Complete the 3-to-8 decoder. When sel=3'b101, which output line should be HIGH?",
    code: `module dec3to8(
  input  [2:0] sel,
  input        en,
  output reg [7:0] out
);
  always @(*) begin
    if (!en) out = 8'b0;
    else begin
      out = 8'b0;
      out[___(A)] = 1'b1;
    end
  end
endmodule`,
    blank_label: "Fill in the blank (A) — the index to set HIGH",
    options: [
      "3",
      "4",
      "5",
      "6"
    ],
    answer: "5",
    explanation: "A decoder sets the output line matching the binary value of sel. sel=3'b101 = decimal 5, so out[5] should be set HIGH. out[sel] is the general form."
  },
  {
    id: "C3", section: "C", lab: "Lab 3",
    type: "fill_blank",
    question: "Complete the 8-bit full adder by connecting the carry chain correctly:",
    code: `module adder8bit(
  input  [7:0] A, B,
  input        Cin,
  output [7:0] Sum,
  output       Cout
);
  wire c0, c1, c2, c3, c4, c5, c6;

  full_adder fa0(.A(A[0]),.B(B[0]),.Cin(Cin), .Sum(Sum[0]),.Cout(___(A)));
  full_adder fa1(.A(A[1]),.B(B[1]),.Cin(c0),  .Sum(Sum[1]),.Cout(c1));
  // ... fa2 through fa6 ...
  full_adder fa7(.A(A[7]),.B(B[7]),.Cin(c6),  .Sum(Sum[7]),.Cout(___(B)));
endmodule`,
    blank_label: "Fill blanks (A) and (B) — the carry connections",
    options: [
      "(A)=c1, (B)=Cout",
      "(A)=c0, (B)=Cout",
      "(A)=Cout, (B)=c6",
      "(A)=c0, (B)=c7"
    ],
    answer: "(A)=c0, (B)=Cout",
    explanation: "fa0's carry-out feeds fa1's carry-in as c0. The final adder fa7's carry-out is the module's final Cout. The chain is: Cin→fa0→c0→fa1→c1→...→c6→fa7→Cout."
  },
  {
    id: "C4", section: "C", lab: "Lab 4",
    type: "fill_blank",
    question: "Complete the behavioral MUX using a case statement. What keyword fills the always block sensitivity list for combinational logic?",
    code: `module mux4_behavioral(
  input  [3:0] i0, i1, i2, i3,
  input  [1:0] sel,
  output reg [3:0] out
);
  always @(___(A)) begin
    case(sel)
      2'b00: out = i0;
      2'b01: out = i1;
      2'b10: out = i2;
      default: out = i3;
    endcase
  end
endmodule`,
    blank_label: "Fill in blank (A) — sensitivity list for combinational logic",
    options: [
      "posedge sel",
      "sel or i0 or i1 or i2 or i3",
      "*",
      "clk"
    ],
    answer: "*",
    explanation: "The wildcard (*) in the sensitivity list means 'trigger whenever ANY input changes' — the standard way to model combinational logic in behavioral Verilog. It is equivalent to listing all inputs."
  },
  {
    id: "C5", section: "C", lab: "Lab 5",
    type: "fill_blank",
    question: "Complete the D Flip-Flop with SYNCHRONOUS reset. What is the correct sensitivity list?",
    code: `module dff_sync(
  input  clk, rst, d,
  output reg q
);
  always @(___(A)) begin
    if (!rst)
      q <= 1'b0;
    else
      q <= d;
  end
endmodule`,
    blank_label: "Fill in blank (A) — sensitivity list for synchronous reset DFF",
    options: [
      "posedge clk or negedge rst",
      "posedge clk",
      "posedge clk or posedge rst",
      "*"
    ],
    answer: "posedge clk",
    explanation: "Synchronous reset means reset is only checked at the clock edge. So only 'posedge clk' is in the sensitivity list. If rst were asynchronous, we'd add 'or negedge rst'."
  },
  {
    id: "C6", section: "C", lab: "Lab 6",
    type: "fill_blank",
    question: "Complete the ALU operation for opcode 3'b110 (Right Shift by 1):",
    code: `module alu(
  input  [7:0] Din_A, Din_B,
  input  [2:0] opcode,
  output reg [7:0] D_Out,
  output reg       Zero_Flag
);
  always @(*) begin
    case(opcode)
      3'b000: D_Out = Din_A + Din_B;
      3'b001: D_Out = Din_B - Din_A;
      3'b010: D_Out = Din_A * Din_B;
      3'b011: D_Out = Din_A & Din_B;
      3'b100: D_Out = Din_A | Din_B;
      3'b101: D_Out = ~Din_A;
      3'b110: D_Out = ___(A);
      3'b111: D_Out = Din_A << 1;
    endcase
    Zero_Flag = ___(B);
  end
endmodule`,
    blank_label: "Fill blanks (A) and (B)",
    options: [
      "(A) = Din_A >> 1 ;  (B) = (D_Out == 8'b0)",
      "(A) = Din_A << 1 ;  (B) = (D_Out == 8'b0)",
      "(A) = Din_A >> 1 ;  (B) = (Din_A == 8'b0)",
      "(A) = Din_A >> 2 ;  (B) = (D_Out == 1'b0)"
    ],
    answer: "(A) = Din_A >> 1 ;  (B) = (D_Out == 8'b0)",
    explanation: "3'b110 is Right Shift by 1: Din_A >> 1. Zero_Flag checks if the RESULT (D_Out) is zero — not the input. (D_Out == 8'b0) is correct."
  },
  {
    id: "C7", section: "C", lab: "Lab 6",
    type: "fill_blank",
    question: "Complete the Register File read logic. Dout_A and Dout_B should be continuously assigned from the register array:",
    code: `module reg_file(
  input        clk, rst, Write,
  input  [1:0] DA, AA, BA,
  input  [7:0] Din,
  output [7:0] Dout_A, Dout_B
);
  reg [7:0] regs [0:3];

  always @(posedge clk or negedge rst) begin
    if (!rst) begin
      regs[0]<=8'b0; regs[1]<=8'b0;
      regs[2]<=8'b0; regs[3]<=8'b0;
    end else if (Write)
      regs[DA] <= Din;
  end

  assign Dout_A = ___(A);
  assign Dout_B = ___(B);
endmodule`,
    blank_label: "Fill blanks (A) and (B) — the read port assignments",
    options: [
      "(A) = regs[DA] ;  (B) = regs[DA]",
      "(A) = regs[AA] ;  (B) = regs[BA]",
      "(A) = regs[BA] ;  (B) = regs[AA]",
      "(A) = Din ;  (B) = Din"
    ],
    answer: "(A) = regs[AA] ;  (B) = regs[BA]",
    explanation: "AA (Address A) selects which register appears on Dout_A. BA (Address B) selects which register appears on Dout_B. These are independent read ports — they can read different registers simultaneously."
  },
];
