# Changelog

All notable changes to this project will be documented in this file.

## [1.6.0] - 2024-11-19

### Security
- Replaced deprecated `request` package with `axios` to fix critical vulnerabilities
  - GHSA-fjxv-7rqg-78g4 (form-data unsafe random)
  - GHSA-72xf-g2v4-qvf3 (tough-cookie prototype pollution)
- Updated `qs` from ^6.7.0 to ^6.11.0
- Updated `winston` from ^3.2.1 to ^3.11.0
- Updated `dotenv` from ^7.0.0 to ^16.0.0
- Production dependencies now have 0 vulnerabilities

### Changed
- Replaced `request` with `axios` for all HTTP calls
- Replaced `request.form()` with `form-data` package for file uploads
- Translated all Chinese comments to English

### Added
- `form-data` dependency for multipart uploads

### Removed
- `request` dependency

## [1.5.0] - 2019-07-19

### Fixed
- Fixed list method

### Added
- Added `protocol` option (http/https)
- Added default values for `port` (5000) and `protocol` (http)

## [1.0.0] - Initial Release

### Added
- Authentication (login)
- FileStation operations:
  - list
  - listShare
  - info
  - search
  - upload
  - download
  - delete
  - rename
  - createFolder
  - copyMove
