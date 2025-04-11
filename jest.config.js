module.exports = {
    collectCoverage: true,
    coverageDirectory: 'coverage',  // Đặt nơi lưu báo cáo độ phủ
    coverageReporters: ['text', 'html'],
    collectCoverageFrom: [
      'server/models/**/*.{js,ts}',  // Chỉ đo độ phủ cho mã nguồn trong thư mục models
      '!server/models/**/index.js',   // Loại trừ tệp không cần thiết
    ],
  };