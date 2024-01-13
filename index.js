const fs = require("fs");
const readline = require("readline-sync");

class TUNGMMO {
  constructor() {
    this.data = "data.json";
    this.jsonData = null;
  }

  generateRandomId(length = 8) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  hanhkiem(data) {
    if (Number(data) >= 5 || Number(data) <= 6.75) {
      return "trung bình";
    } else if (Number(data) >= 4) {
      return "yếu";
    } else if (Number(data) >= 7 || Number(data) <= 7.75) {
      return "khá";
    } else if (Number(data) <= 10) {
      return "giỏi";
    }
  }

  openFile(callback) {
    fs.readFile(this.data, "utf8", (err, data) => {
      if (err) {
        console.error("Lỗi khi đọc tệp tin:", err);
        return;
      }

      try {
        this.jsonData = JSON.parse(data);
        callback(this.jsonData);
      } catch (error) {
        console.error("Lỗi khi phân tích nội dung JSON:", error);
      }
    });
  }

  main() {
    let isRunning = true;

    while (isRunning) {
      console.clear();
      console.log("(0) Tao SINH VIEN");
      console.log("(1) DANH SACH SINH VIEN");
      console.log("(2) TIM KIEM SINH VIEN");
      console.log("(3) THOAT");

      const luachon = readline.questionInt("LUA CHON CUA BAN: ");

      switch (luachon) {
        case 0:
          console.clear();

          let isDuplicateId = true;
          let newStudentId;

          while (isDuplicateId) {
            newStudentId = this.generateRandomId(5);
            isDuplicateId = this.jsonData.some(
              (student) => student["Mã sinh viên"] === newStudentId
            );
          }

          const newStudent = {
            "Mã sinh viên": newStudentId,
            "họ và tên": readline.question("NHAP HO VA TEN: "),
            "Ngày sinh": readline.question("NHAP NGAY SINH: "),
            "Quê quán": readline.question("NHAP QUE QUAN: "),
            điểm: [
              {
                Toán: parseFloat(readline.question("NHAP DIEM TOAN: ")),
                Lí: parseFloat(readline.question("NHAP DIEM LI: ")),
                Hóa: parseFloat(readline.question("NHAP DIEM HOA: ")),
                "Trung Bình": 0,
                "Hạnh kiểm": null,
              },
            ],
          };

          const toan = parseFloat(newStudent["điểm"][0]["Toán"]);
          const ly = parseFloat(newStudent["điểm"][0]["Lí"]);
          const hoa = parseFloat(newStudent["điểm"][0]["Hóa"]);

          if (!isNaN(toan) && !isNaN(ly) && !isNaN(hoa)) {
            const diemTrungBinh = (toan + ly + hoa) / 3;
            newStudent["điểm"][0]["Trung Bình"] = parseFloat(
              diemTrungBinh.toFixed(2)
            );

            newStudent["điểm"][0]["Hạnh kiểm"] = this.hanhkiem(
              parseFloat(diemTrungBinh.toFixed(2))
            );

            this.jsonData.push(newStudent);
            const jsonDataString = JSON.stringify(this.jsonData, null, 2);
            fs.writeFileSync(this.data, jsonDataString);
            console.log("SINH VIÊN ĐÃ ĐƯỢC TẠO.");
          } else {
            console.log("Invalid scores provided.");
          }

          let chonx = true;
          console.log("(0) Quay lại");

          while (chonx) {
            const luachon = readline.questionInt("LUA CHON CUA BAN : ");

            if (luachon === 0) {
              chonx = false;
            } else {
              console.log("Lựa chọn không hợp lệ. Vui lòng chọn lại.");
            }
          }

          break;

        case 1:
          console.clear();

          const formattedData = this.jsonData.map((item) => {
            return {
              "Mã sinh viên": item["Mã sinh viên"],
              "Họ và tên": item["họ và tên"],
              "Ngày sinh": item["Ngày sinh"],
              "Quê quán": item["Quê quán"],
              "Điểm Toán": item["điểm"][0]["Toán"],
              "Điểm Lý": item["điểm"][0]["Lí"],
              "Điểm Hóa": item["điểm"][0]["Hóa"],
              "Điểm Trung Bình": item["điểm"][0]["Trung Bình"],
              "Hạnh kiểm": item["điểm"][0]["Hạnh kiểm"],
            };
          });

          console.table(formattedData);

          let chon = true;
          console.log("(0) Quay lại");

          while (chon) {
            const luachon = readline.questionInt("LUA CHON CUA BAN : ");

            if (luachon === 0) {
              chon = false;
            } else {
              console.log("Lựa chọn không hợp lệ. Vui lòng chọn lại.");
            }
          }

          break;

        case 2:
          console.clear();
          const searchQuery = readline.question("NHAP TU KHOA TIM KIEM: ");
          const searchResults = this.jsonData.filter((item) => {
            const keywords = [
              item["Mã sinh viên"],
              item["họ và tên"],
              item["Ngày sinh"],
              item["Quê quán"],
              item["Hạnh kiểm"],
            ];

            return keywords.some((keyword) =>
              String(keyword).toLowerCase().includes(searchQuery.toLowerCase())
            );
          });

          if (searchResults.length > 0) {
            searchResults.forEach((foundData) => {
              const formattedData = {
                "Mã sinh viên": foundData["Mã sinh viên"],
                "Họ và tên": foundData["họ và tên"],
                "Ngày sinh": foundData["Ngày sinh"],
                "Quê quán": foundData["Quê quán"],
                "Điểm Toán": foundData["điểm"][0]["Toán"],
                "Điểm Lý": foundData["điểm"][0]["Lí"],
                "Điểm Hóa": foundData["điểm"][0]["Hóa"],
                "Điểm Trung Bình": foundData["điểm"][0]["Trung Bình"],
                "Hạnh kiểm": foundData["điểm"][0]["Hạnh kiểm"],
              };
              console.table([formattedData]);
            });

            let chon2 = true;
            console.log("(0) Quay lại");
            console.log("(1) Chỉnh sửa sinh viên");
            console.log("(2) Xóa sinh viên");

            while (chon2) {
              const luachon = readline.questionInt("LUA CHON CUA BAN: ");

              if (luachon === 0) {
                chon2 = false;
              } else if (luachon === 1) {
                const SEARCH = readline.question("NHAP MA SINH VIEN CAN SUA: ");

                const check = this.jsonData.findIndex(
                  (item) => item["Mã sinh viên"] === SEARCH
                );

                if (check > -1) {
                  const foundData = this.jsonData[check];
                  const updatedData = { ...foundData };
                  console.log("BẠN MUỐN SỬA MỤC NÀO:");
                  console.log("(0) Họ và tên");
                  console.log("(1) Ngày sinh");
                  console.log("(2) Quê quán");
                  console.log("(3) Điểm Toán");
                  console.log("(4) Điểm Lý");
                  console.log("(5) Điểm Hóa");

                  const fieldIndex = readline.questionInt("CHON MUC CAN SUA: ");

                  if (fieldIndex >= 0 && fieldIndex <= 5) {
                    let field;

                    switch (fieldIndex) {
                      case 0:
                        field = "họ và tên";
                        updatedData[field] =
                          readline.question("NHAP HO VA TEN: ");
                        break;

                      case 1:
                        field = "Ngày sinh";
                        updatedData[field] =
                          readline.question("NHAP NGAY SINH: ");
                        break;

                      case 2:
                        field = "Quê quán";
                        updatedData[field] =
                          readline.question("NHAP QUE QUAN: ");
                        break;

                      case 3:
                        field = "Toán";
                        updatedData["điểm"][0][field.trim()] = parseFloat(
                          readline.question("NHAP DIEM TOAN: ")
                        );
                        break;

                      case 4:
                        field = "Lý";
                        updatedData["điểm"][0][field.trim()] = parseFloat(
                          readline.question("NHAP DIEM LY: ")
                        );
                        break;

                      case 5:
                        field = "Hóa";
                        updatedData["điểm"][0][field.trim()] = parseFloat(
                          readline.question("NHAP DIEM HOA: ")
                        );
                        break;

                      default:
                        break;
                    }

                    const toan = parseFloat(updatedData["điểm"][0]["Toán"]);
                    const ly = parseFloat(updatedData["điểm"][0]["Lí"]);
                    const hoa = parseFloat(updatedData["điểm"][0]["Hóa"]);

                    if (!isNaN(toan) && !isNaN(ly) && !isNaN(hoa)) {
                      const diemTrungBinh = (toan + ly + hoa) / 3;
                      updatedData["điểm"][0]["Trung Bình"] = parseFloat(
                        diemTrungBinh.toFixed(2)
                      );

                      newStudent["điểm"][0]["Hạnh kiểm"] = this.hanhkiem(
                        parseFloat(diemTrungBinh.toFixed(2))
                      );
                    } else {
                      console.log("Invalid scores provided.");
                    }

                    this.jsonData[check] = updatedData;
                    const jsonDataString = JSON.stringify(
                      this.jsonData,
                      null,
                      2
                    );
                    fs.writeFileSync(this.data, jsonDataString);
                    console.log("THÔNG TIN ĐÃ ĐƯỢC CẬP NHẬT.");
                  } else {
                    console.log(
                      "Vị trí môn học không hợp lệ. Vui lòng chọn lại."
                    );
                  }
                } else {
                  console.log(
                    "Không tìm thấy sinh viên với Mã sinh viên đã nhập."
                  );

                  let chon = true;
                  console.log("(0) Quay lại");

                  while (chon) {
                    const luachon = readline.questionInt("LUA CHON CUA BAN : ");

                    if (luachon === 0) {
                      chon = false;
                      chon2 = false;
                    } else {
                      console.log("Lựa chọn không hợp lệ. Vui lòng chọn lại.");
                    }
                  }
                }
              } else if (luachon === 2) {
                const SEARCH = readline.question("NHAP MA SINH VIEN CAN XOA: ");

                const check = this.jsonData.findIndex(
                  (item) => item["Mã sinh viên"] === SEARCH
                );

                if (check > -1) {
                  this.jsonData.splice(check, 1);
                  const jsonDataString = JSON.stringify(this.jsonData, null, 2);
                  fs.writeFileSync(this.data, jsonDataString);
                  console.log("SINH VIÊN ĐÃ ĐƯỢC XÓA.");

                  let chon = true;
                  console.log("(0) Quay lại");

                  while (chon) {
                    const luachon = readline.questionInt("LUA CHON CUA BAN : ");

                    if (luachon === 0) {
                      chon = false;
                      chon2 = false;
                    } else {
                      console.log("Lựa chọn không hợp lệ. Vui lòng chọn lại.");
                    }
                  }
                } else {
                  console.log(
                    "Không tìm thấy sinh viên với Mã sinh viên đã nhập."
                  );
                  let chon = true;
                  console.log("(0) Quay lại");

                  while (chon) {
                    const luachon = readline.questionInt("LUA CHON CUA BAN : ");

                    if (luachon === 0) {
                      chon = false;
                      chon2 = false;
                    } else {
                      console.log("Lựa chọn không hợp lệ. Vui lòng chọn lại.");
                    }
                  }
                }
              } else {
                console.log("Lựa chọn không hợp lệ. Vui lòng chọn lại.");
              }
            }
          } else {
            console.log("Không tìm thấy sinh viên với thông tin đã nhập.");
            let chon = true;
            console.log("(0) Quay lại");

            while (chon) {
              const luachon = readline.questionInt("LUA CHON CUA BAN : ");

              if (luachon === 0) {
                chon = false;
              } else {
                console.log("Lựa chọn không hợp lệ. Vui lòng chọn lại.");
              }
            }
          }

          break;

        case 3:
          isRunning = false;
          break;

        default:
          console.log("Lựa chọn không hợp lệ. Vui lòng chọn lại.");
          break;
      }
    }
  }
}

const instance = new TUNGMMO();
instance.openFile(instance.main.bind(instance));
