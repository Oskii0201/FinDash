const NextResponse = {
  json: jest.fn((data, options) => ({
    body: JSON.stringify(data),
    ...options,
  })),
  redirect: jest.fn((url, statusCode) => ({ url, statusCode })),
};

const NextRequest = jest.fn(() => ({
  headers: new Map(),
  cookies: new Map(),
  url: "",
  method: "GET",
  body: null,
}));

module.exports = { NextResponse, NextRequest };
