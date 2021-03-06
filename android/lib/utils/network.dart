import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:io';
import 'package:shared_preferences/shared_preferences.dart';

class NetworkUtil {
  static NetworkUtil _instance = new NetworkUtil.internal();
  NetworkUtil.internal();
  factory NetworkUtil() => _instance;

  Future<dynamic> get(String url) {
    return http.get(url, headers: {
      HttpHeaders.contentTypeHeader: 'application/x-www-form-urlencoded',
      HttpHeaders.acceptHeader: 'application/json'
    }).then((http.Response response) {
      final String res = response.body;
      final int statusCode = response.statusCode;

      if (statusCode < 200 || statusCode > 400) {
        throw new Exception('Error while fetching data');
      }

      if (res.isEmpty) return null;

      return json.decode(res);
    });
  }

  Future<dynamic> post(String url, {Map body, encoding}) {
    return http
        .post(url,
            body: body,
            headers: {
              HttpHeaders.contentTypeHeader:
                  'application/x-www-form-urlencoded',
              HttpHeaders.acceptHeader: 'application/json'
            },
            encoding: encoding)
        .then((http.Response response) {
      final String res = response.body;
      final int statusCode = response.statusCode;

      if (statusCode < 200 || statusCode > 400) {
        throw new Exception('Error while fetching data');
      }

      if (res.isEmpty) return null;

      return json.decode(res);
    });
  }
}
