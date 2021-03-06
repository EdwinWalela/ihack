import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:afyabora/utils/api.dart';
import 'package:afyabora/models/doctors/doctor.dart';
import 'package:afyabora/models/diagnoses/diagnosis.dart';

class AddDiagnosis extends StatefulWidget {
  @override
  AddDiagnosisScreen createState() => AddDiagnosisScreen();
}

class _DiagData {
  String diagnosis = '', centerOfDiagnosis = '', symptoms = '', dosage = '';
}
class AddDiagnosisScreen extends State<AddDiagnosis> {

  final _addDiagnosisFormKey = GlobalKey<FormState>();
  
  SharedPreferences prefs;

  _DiagData _diagData = new _DiagData();
  @override
  Widget build(BuildContext context) {
    
    final Size screenSize = MediaQuery.of(context).size;
    return Scaffold(
        appBar: AppBar(
          title: Text('Add Diagnosis'),
        ),
        body: Form(
            key: _addDiagnosisFormKey,
            child: Container(
                padding: EdgeInsets.all(20.0),
                child:
                 ListView(children: <Widget>[
                  TextFormField(
                    keyboardType: TextInputType.multiline,
                    maxLines: 3,
                    decoration: InputDecoration(
                        hintText: 'This illness', labelText: 'Diagnosis'),
                    validator: validateString,
                    onSaved: (String diagnosis) {
                      this._diagData.diagnosis = diagnosis;
                    },
                  ),
                  TextFormField(
                    keyboardType: TextInputType.text,
                    decoration: InputDecoration(
                        hintText: 'The Clinic',
                        labelText: 'Center of Diagnosis'),
                    validator: validateString,
                    onSaved: (String center) {
                      this._diagData.centerOfDiagnosis = center;
                    },
                  ),
                  TextFormField(
                    keyboardType: TextInputType.multiline,
                    maxLines: 3,
                    decoration: InputDecoration(
                        hintText: 'Symptoms', labelText: 'Symptoms'),
                    validator: validateString,
                    onSaved: (String symptoms) {
                      this._diagData.symptoms = symptoms;
                    },
                  ),
                  TextFormField(
                    keyboardType: TextInputType.multiline,
                    maxLines: 3,
                    decoration: InputDecoration(
                        hintText: 'Dosage', labelText: 'Dosage'),
                    validator: validateString,
                    onSaved: (String dosage) {
                      this._diagData.dosage = dosage;
                    },
                  ),
                  Container(
                      width: screenSize.width,
                      child: RaisedButton(
                        onPressed: addDiagnosis,
                        color: Colors.blue,
                        child: Text(
                          'Add Diagnosis',
                          style: TextStyle(color: Colors.white),
                        ),
                      )),
                ]))));
  }

  void addDiagnosis() {
    if (_addDiagnosisFormKey.currentState.validate()) {
      _addDiagnosisFormKey.currentState.save();

      api.addDiagnosis(
      _diagData.diagnosis,
        _diagData.centerOfDiagnosis,
        _diagData.symptoms,
        _diagData.dosage
      ).then((diagnosis) {
        if (null) {
          Scaffold.of(context).showSnackBar(SnackBar(
            content: Text('Success! Diagnosis added'),
            backgroundColor: Colors.greenAccent,
            action: SnackBarAction(
              label: 'Go Home',
              onPressed: goToDeposits,
            ),
          ));
        } else {
          Scaffold.of(context).showSnackBar(SnackBar(
            content: Text('Failed to add this diagnosis'),
            backgroundColor: Colors.greenAccent,
          ));
        }
      });
    }
  }

  String validateString(String value) {
    if (value.length >= 0) {
      return null;
    }

    return 'Please input something';
  }

  void goToDeposits() {
    Navigator.pushNamed(context, '/dashboard');
  }
}
